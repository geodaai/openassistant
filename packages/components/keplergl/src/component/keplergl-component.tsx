// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { useEffect, useRef, useState, useCallback } from 'react';
import { Provider } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { IntlProvider } from 'react-intl';

import { addDataToMap, addLayer } from '@kepler.gl/actions';
import { RootContext } from '@kepler.gl/components';
import { Layer } from '@kepler.gl/layers';
import { messages } from '@kepler.gl/localization';
import {
  FileCacheItem,
  processFileData,
  ProcessFileDataContent,
} from '@kepler.gl/processors';
import { theme as keplerTheme } from '@kepler.gl/styles';
import { Table as ArrowTable } from 'apache-arrow';

import { KeplerMiniMap } from './keplergl-mini-map';
import { KeplerState, MAP_ID, store } from './keplergl-provider';
import { isArrowTable, createKeplerArrowDataset } from './arrow-utils';
import { datasetRegistry } from './dataset-registry';

type ColorMap = {
  value: string | number | null;
  color: string;
  label?: string;
}[];

/**
 * Function to fetch dataset from DuckDB or other data sources
 * Returns an Arrow Table that can be used directly by Kepler.gl
 */
export type GetDatasetFunction = (tableName: string) => Promise<unknown>;

export type CreateMapOutputData = {
  id?: string;
  datasetId: string;
  layerId: string;
  /** Pre-fetched dataset for Kepler.gl (will be ignored if tableName and getDataset are provided) */
  datasetForKepler?: FileCacheItem[];
  /** Table name to fetch data from (used with getDataset for lazy loading) */
  tableName?: string;
  /** Function to fetch dataset lazily (e.g., from DuckDB) */
  getDataset?: GetDatasetFunction;
  theme?: string;
  /** Layer configuration - can be a JSON string or an object */
  layerConfig?: string | Record<string, unknown>;
  colorBy?: string;
  colorType?: 'breaks' | 'unique';
  colorMap?: ColorMap;
  width?: number;
  height?: number;
};

export function isCreateMapOutputData(
  data: unknown
): data is CreateMapOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'datasetId' in data &&
    ('datasetForKepler' in data || ('tableName' in data && 'getDataset' in data))
  );
}

// export function KeplerGlToolComponent(props: CreateMapOutputData) {
//   const id = props.id || generateId();

//   return (
//     <ResizablePlotContainer defaultHeight={350} key={id}>
//       <KeplerGlComponentWithProvider {...props} />
//     </ResizablePlotContainer>
//   );
// }

export function KeplerGlComponent(props: CreateMapOutputData) {
  const rootNode = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        resize: 'both',
        overflow: 'auto',
        minWidth: '200px',
        minHeight: '300px',
        width: '100%',
        height: '300px',
      }}
    >
      <MapLegend
        colorBy={props.colorBy}
        colorType={props.colorType}
        colorMap={props.colorMap}
      />
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 20px)', // Account for legend height
        }}
      >
        <AutoSizer>
          {({ width, height }) => {
            return (
              <RootContext.Provider value={rootNode}>
                <Provider store={store}>
                  <ThemeProvider theme={keplerTheme}>
                    <KeplerGlMiniComponent
                      {...props}
                      width={width}
                      height={height}
                    />
                  </ThemeProvider>
                </Provider>
              </RootContext.Provider>
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
}

function MapLegend(props: {
  colorBy?: string;
  colorType?: 'breaks' | 'unique';
  colorMap?: ColorMap;
}) {
  const { colorBy, colorType, colorMap } = props;

  const formatLabel = (
    value: string | number | null,
    index: number,
    label?: string
  ) => {
    if (colorType === 'breaks') {
      if (value !== null) {
        return label || `<= ${value}`;
      } else {
        const previousValue = colorMap?.[index - 1]?.value;
        return label || `> ${previousValue}`;
      }
    }

    return label || String(value);
  };

  return colorBy && colorType && colorMap ? (
    <div style={{ fontSize: '0.6rem', width: '100%', marginTop: '-20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.1rem',
        }}
      >
        <div
          style={{
            fontSize: '0.6rem',
            fontWeight: 500,
          }}
        >
          {colorBy}
        </div>
        {colorMap?.map((item, index) => (
          <div
            key={index}
            style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}
          >
            <div
              style={{
                width: '1rem',
                height: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.125rem',
                flexShrink: 0,
                backgroundColor: item.color,
              }}
            />
            <span
              style={{
                fontSize: '0.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              {formatLabel(item.value, index, item.label)}
            </span>
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

export function KeplerGlMiniComponent(props: CreateMapOutputData) {
  const dispatch = useDispatch();
  const dataAddedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { datasetForKepler, tableName, getDataset, layerConfig, datasetId } = props;

  const keplerMessages = messages['en'];

  const keplerState = useSelector(
    (state: KeplerState) => state?.keplerGl[MAP_ID]
  );

  /**
   * Fetch dataset from DuckDB or other data source
   * Uses Arrow format directly for best performance with Kepler.gl
   */
  const fetchDataset = useCallback(async (): Promise<FileCacheItem[] | null> => {
    // If no tableName, use pre-fetched data
    if (!tableName) {
      return datasetForKepler || null;
    }

    // Try to get the getDataset function from props or from the registry
    const datasetFetcher = getDataset || datasetRegistry.get(datasetId || tableName);
    
    if (!datasetFetcher) {
      console.warn('No getDataset function provided or registered, falling back to datasetForKepler');
      return datasetForKepler || null;
    }

    try {
      const fetchedData = await datasetFetcher(tableName);
      const name = datasetId || tableName;

      // If it's an Arrow table, normalize it to a kepler.gl-compatible Arrow
      // dataset using this app's apache-arrow instance. This lets kepler.gl
      // use its native ArrowDataContainer path without row conversion.
      if (isArrowTable(fetchedData)) {
        const arrowDataset = createKeplerArrowDataset(
          fetchedData as ArrowTable,
          name
        );
        return [arrowDataset as FileCacheItem];
      }

      // If it's already row data, process it through Kepler.gl's processor
      if (Array.isArray(fetchedData)) {
        const processDataContent: ProcessFileDataContent = {
          data: fetchedData,
          fileName: name,
        };

        const processedData = await processFileData({
          content: processDataContent,
          fileCache: [],
        });

        if (processedData && processedData.length > 0) {
          processedData[0].info.id = name;
        }

        return processedData;
      }

      console.warn(
        'getDataset returned unexpected data type, falling back to datasetForKepler'
      );
      return datasetForKepler || null;
    } catch (err) {
      console.error('Failed to create table', err);
      throw err;
    }
  }, [tableName, getDataset, datasetForKepler, datasetId]);

  useEffect(() => {
    let isMounted = true;

    const addData = async () => {
      if (dataAddedRef.current) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch dataset (either from DuckDB or use pre-fetched data)
        const datasets = await fetchDataset();
        
        if (!datasets || datasets.length === 0) {
          throw new Error('No dataset available');
        }

        if (!isMounted) {
          return;
        }

        // parse layerConfig
        const layerConfigObj = layerConfig
          ? typeof layerConfig === 'string'
            ? JSON.parse(layerConfig)
            : layerConfig
          : {};

        // check if layer already exists
        const layerExists = keplerState?.visState?.layers.find(
          (layer: Layer) =>
            layer.config.dataId ===
            layerConfigObj?.config?.visState?.layers?.[0]?.id
        );
        if (layerExists) {
          setIsLoading(false);
          return;
        }

        // check if dataset already exists
        const newDatasetId = datasets[0].info.id || '';
        const datasetExists = Object.keys(
          keplerState?.visState?.datasets || {}
        ).includes(newDatasetId);

        if (datasetExists) {
          // add new layer
          dispatch(
            addLayer(layerConfigObj.config.visState.layers[0], newDatasetId)
          );
        } else {
          // add new dataset and layer
          dispatch(
            addDataToMap({
              datasets: datasets,
              options: {
                centerMap: true,
                readOnly: false,
                autoCreateLayers: true,
                autoCreateTooltips: true,
                keepExistingConfig:
                  Object.keys(keplerState?.visState?.datasets || {}).length > 0,
              },
              config: layerConfigObj,
            })
          );
        }
        dataAddedRef.current = true;
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    addData();

    return () => {
      isMounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // get layer by layerId
  const layerId = keplerState?.visState?.layers.find(
    (layer: Layer) => layer.id === props.layerId
  )?.id;

  if (error) {
    return (
      <div
        style={{
          width: `${props.width}px`,
          height: `${props.height ? props.height - 20 : 180}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff4444',
          fontSize: '14px',
        }}
      >
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          width: `${props.width}px`,
          height: `${props.height ? props.height - 20 : 180}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px',
        }}
      >
        Loading map data...
      </div>
    );
  }

  return (
    <>
      {keplerState?.visState?.layers?.length > 0 && keplerState?.uiState && (
        <div
          style={{
            width: `${props.width}px`,
            height: `${props.height ? props.height - 20 : 180}px`,
          }}
        >
          <IntlProvider locale="en" messages={keplerMessages}>
            <KeplerMiniMap
              keplerTheme={keplerTheme}
              layerId={layerId || keplerState?.visState?.layers[0]?.id}
              mapWidth={props.width}
              mapHeight={props.height}
            />
          </IntlProvider>
        </div>
      )}
    </>
  );
}
