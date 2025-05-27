import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { IntlProvider } from 'react-intl';

import { addDataToMap } from '@kepler.gl/actions';
import { RootContext } from '@kepler.gl/components';
import { Layer } from '@kepler.gl/layers';
import { messages } from '@kepler.gl/localization';
import { FileCacheItem } from '@kepler.gl/processors';
import { theme as keplerTheme } from '@kepler.gl/styles';

import { KeplerMiniMap } from './keplergl-mini-map';
import { KeplerState, MAP_ID, store } from './keplergl-provider';

export type CreateMapOutputData = {
  id?: string;
  datasetId: string;
  datasetForKepler: FileCacheItem[];
  theme?: string;
  isDraggable?: boolean;
  layerConfig?: string;
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
    'datasetForKepler' in data
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
  );
}

export function KeplerGlMiniComponent(props: CreateMapOutputData) {
  const dispatch = useDispatch();
  const dataAddedRef = useRef(false);

  const { datasetForKepler, layerConfig } = props;

  const keplerMessages = messages['en'];

  const keplerState = useSelector(
    (state: KeplerState) => state?.keplerGl[MAP_ID]
  );

  useEffect(() => {
    let isMounted = true;

    const addData = async () => {
      if (dataAddedRef.current) {
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
      if (layerExists || !isMounted) {
        return;
      }

      dispatch(
        addDataToMap({
          datasets: datasetForKepler,
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
      dataAddedRef.current = true;
    };

    addData();

    return () => {
      isMounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // {/* <KeplerGl
  //   id={MAP_ID}
  //   width={280}
  //   height={280}
  //   theme={keplerTheme}
  // /> */}

  // get layerId using datasetName
  const layerId = keplerState?.visState?.layers.find(
    (layer: Layer) =>
      layer.config.label === props.datasetId ||
      layer.config.dataId === props.datasetId
  )?.id;

  return (
    <>
      {keplerState?.visState?.layers?.length > 0 && keplerState?.uiState && (
        <div style={{ width: `${props.width}px`, height: `${props.height}px` }}>
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
