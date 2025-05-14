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

import { ExpandableContainer } from '@openassistant/common';
import { generateId } from '@openassistant/utils';

import { KeplerMiniMap } from './keplergl-mini-map';
import { KeplerState, MAP_ID, store } from './keplergl-provider';

export type CreateMapOutputData = {
  id?: string;
  datasetName: string;
  datasetForKepler: FileCacheItem[];
  theme?: string;
  isDraggable?: boolean;
  layerConfig?: string;
};

export function isCreateMapOutputData(
  data: unknown
): data is CreateMapOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'datasetName' in data &&
    'datasetForKepler' in data
  );
}

export function KeplerGlToolComponent(props: CreateMapOutputData) {
  const id = props.id || generateId();

  const onDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: `map-${id}`,
        type: 'map',
        data: props,
      })
    );
  };

  return (
    <ExpandableContainer
      defaultWidth={300}
      defaultHeight={350}
      draggable={props.isDraggable || false}
      onDragStart={onDragStart}
    >
      <KeplerGlComponentWithProvider {...props} />
    </ExpandableContainer>
  );
}

export function KeplerGlComponentWithProvider(props: CreateMapOutputData) {
  const rootNode = useRef<HTMLDivElement>(null);

  return (
    <AutoSizer>
      {({ width = 480, height = 480 }) => (
        <RootContext.Provider value={rootNode}>
          <Provider store={store}>
            <ThemeProvider theme={keplerTheme}>
              <KeplerGlComponent {...props} width={width} height={height} />
            </ThemeProvider>
          </Provider>
        </RootContext.Provider>
      )}
    </AutoSizer>
  );
}

export function KeplerGlComponent(
  props: CreateMapOutputData & { width: number; height: number }
) {
  const dispatch = useDispatch();

  const { datasetForKepler, layerConfig } = props;

  const keplerMessages = messages['en'];

  useEffect(() => {
    // parse layerConfig
    const layerConfigObj = layerConfig ? JSON.parse(layerConfig) : {};
    // using Kepler.gl API to validate the layerConfig
    // const isValid = KeplerGlSchema.parseSavedConfig({
    //   version: 'v1',
    //   config: layerConfigObj,
    // });
    // if (!isValid) {
    //   throw new Error('Invalid layer config');
    // }

    dispatch(
      addDataToMap({
        datasets: datasetForKepler,
        options: {
          centerMap: true,
          readOnly: false,
          autoCreateLayers: true,
          autoCreateTooltips: true,
        },
        config: layerConfigObj,
      })
    );
  }, [dispatch, datasetForKepler, layerConfig]);

  const keplerState = useSelector(
    (state: KeplerState) => state?.keplerGl[MAP_ID]
  );

  // {/* <KeplerGl
  //   id={MAP_ID}
  //   width={280}
  //   height={280}
  //   theme={keplerTheme}
  // /> */}

  // get layerId using datasetName
  const layerId = keplerState?.visState?.layers.find(
    (layer: Layer) =>
      layer.config.label === props.datasetName ||
      layer.config.dataId === props.datasetName
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
