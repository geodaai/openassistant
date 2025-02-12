'use client';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { IntlProvider } from 'react-intl';

import { RootContext } from '@kepler.gl/components';
import { addDataToMap } from '@kepler.gl/actions';
import { theme as keplerTheme } from '@kepler.gl/styles';
import { messages } from '@kepler.gl/localization';

import { KeplerMiniMap } from './keplergl-mini-map';
import { CreateMapOutputData } from '../callback-component';
import { KeplerState, MAP_ID, store } from './keplergl-provider';

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

  const { datasetForKepler } = props;

  const keplerMessages = messages['en'];

  useEffect(() => {
    dispatch(
      addDataToMap({
        datasets: datasetForKepler,
        options: {
          centerMap: true,
          readOnly: false,
          autoCreateLayers: true,
          autoCreateTooltips: true,
        },
      })
    );
  }, [dispatch, datasetForKepler]);

  const keplerState = useSelector(
    (state: KeplerState) => state?.keplerGl[MAP_ID]
  );

  // {/* <KeplerGl
  //   id={MAP_ID}
  //   width={280}
  //   height={280}
  //   theme={keplerTheme}
  // /> */}

  return (
    <>
      {keplerState?.visState?.layers?.length > 0 && keplerState?.uiState && (
        <div style={{ width: `${props.width}px`, height: `${props.height}px` }}>
          <IntlProvider locale="en" messages={keplerMessages}>
            <KeplerMiniMap
              keplerTheme={keplerTheme}
              layerId={keplerState?.visState?.layers[0]?.id}
              mapWidth={props.width}
              mapHeight={props.height}
            />
          </IntlProvider>
        </div>
      )}
    </>
  );
}
