// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { wrapTo } from '@kepler.gl/actions';
import {
  appInjector,
  MapContainerFactory,
  makeGetActionCreators,
  mapFieldsSelector,
  MapViewStateContextProvider,
} from '@kepler.gl/components';
import { Layer } from '@kepler.gl/layers';
import { findMapBounds, uiStateUpdaters } from '@kepler.gl/reducers';
import { MapState } from '@kepler.gl/types';
import { getCenterAndZoomFromBounds } from '@kepler.gl/utils';

import { KeplerState, MAP_ID } from './keplergl-provider';

// disable all map controls
const initialMapUiState = {
  mapControls: Object.keys(uiStateUpdaters.DEFAULT_MAP_CONTROLS).reduce(
    (accu, key) => ({
      ...accu,
      [key]: { active: false, show: false },
    }),
    {}
  ),
  // disable side panel
  activeSidePanel: null,
  // disable toggle button
  readOnly: true,
};

/**
 * The props for the KeplerMiniMap component.
 *
 * @param layerId - The id of the layer to display.
 * @param mapHeight - The height of the map.
 * @param mapWidth - The width of the map.
 * @param keplerTheme - The theme of the map.
 */
export type KeplerMiniMapProps = {
  layerId?: string;
  mapHeight?: number;
  mapWidth?: number;
  keplerTheme?: Record<string, unknown>;
};

/**
 * The KeplerMiniMap component.
 *
 * @param props - The props for the KeplerMiniMap component.
 * @returns The KeplerMiniMap component.
 */
export function KeplerMiniMap({
  layerId,
  keplerTheme,
  mapHeight,
  mapWidth,
}: KeplerMiniMapProps) {
  // For inject customized component to kepler.gl
  const MapContainer = appInjector.get(MapContainerFactory);

  const dispatch = useDispatch();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // get kepler state
  const keplerState = useSelector((state: KeplerState) => {
    // console.log('state.keplerGl[MAP_ID]', state?.keplerGl[MAP_ID]);
    return state?.keplerGl[MAP_ID];
  });

  // map index, always set to 1 since we are using a mini map with the concept of splitMaps in Kepler.gl
  const mapIndex = 1;

  // get kepler actions: visStateActions, mapStateActions, uiStateActions, providerActions, mapStyleActions
  const keplerActionSelector = makeGetActionCreators();
  const keplerOwnProps = {};
  const dispatchKepler = (action) => dispatch(wrapTo(MAP_ID, action));
  const {
    visStateActions,
    mapStateActions,
    uiStateActions,
    providerActions,
    mapStyleActions,
  } = keplerActionSelector(dispatchKepler, keplerOwnProps);

  // get the layer with the given layerId and set it to visible
  const selectedLayers = keplerState?.visState.layers
    .filter((l: Layer) => l.id === layerId)
    .map((l: Layer) => {
      l.updateLayerConfig({
        isVisible: true,
      });
      return l;
    });

  // get the layer data for the selected layer
  const layerData = [
    keplerState?.visState.layerData[
      keplerState?.visState.layers.findIndex((l: Layer) => l.id === layerId)
    ],
  ];

  // get splitmaps, so that only the layer with the given layerId is visible
  const splitMaps = [
    { layers: {} }, // empty layers object for first map
    { layers: layerId ? { [layerId]: true } : {} }, // layers object for second map
  ];

  // const backgroundColor = hexToRgb(
  //   keplerTheme?.textColor === 'textColorLT' ? '#ffffff' : '#000000'
  // );

  const connectedProps = {
    id: MAP_ID,
    // Specify path to keplerGl state, because it is not mounted at the root
    getState: (state: KeplerState) => state?.keplerGl[MAP_ID],
    // width: contentWidth,
    // height: dimensions?.height,
    initialUiState: initialMapUiState,
    mapboxApiAccessToken: '',
    dispatch,
    visStateActions,
    mapStateActions,
    uiStateActions,
    providerActions,
    mapStyleActions,
    visState: {
      ...keplerState?.visState,
      splitMaps,
      layers: selectedLayers,
      layerOrder: layerId ? [layerId] : [],
      layerData,
    },
    mapState: {
      ...keplerState?.mapState,
      isViewportSynced: false,
      isZoomLocked: false,
    },
    uiState: {
      ...keplerState?.uiState,
      ...initialMapUiState,
    },
    providerState: keplerState.providerState,
    mapStyle: {
      ...keplerState?.mapStyle,
      // styleType: NO_MAP_ID,
      // bottomMapStyle: null,
      // backgroundColor,
    },
  };

  const mapFields = mapFieldsSelector(connectedProps, mapIndex);

  // Add ref to track initial render
  const initialMapStateRef = useRef<MapState | null>(null);

  // Calculate newMapState only once and store it
  if (!initialMapStateRef.current) {
    const bounds = findMapBounds(selectedLayers) || [
      -180, -85.05112877980659, 180, 85.0511287798066,
    ];
    const centerAndZoom = getCenterAndZoomFromBounds(bounds, {
      width: mapWidth,
      height: mapHeight,
    });
    initialMapStateRef.current = {
      ...mapFields.mapState,
      ...(centerAndZoom
        ? {
            latitude: centerAndZoom.center[1],
            longitude: centerAndZoom.center[0],
            ...(Number.isFinite(centerAndZoom.zoom)
              ? { zoom: centerAndZoom.zoom }
              : {}),
          }
        : {}),
    };
  }

  const newMapState = initialMapStateRef.current || mapFields.mapState;

  useEffect(() => {
    if (keplerState?.visState.layers.length > 0) {
      // loadMapStyle
      const defaultStyles = Object.values(keplerState?.mapStyle.mapStyles);
      const allStyles = defaultStyles.reduce((accu, style) => {
        // @ts-expect-error style.id is not defined
        accu[style.id] = style;
        return accu;
      }, {});

      mapStyleActions.loadMapStyles(allStyles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Programmatically hide mapboxgl-children div
  useEffect(() => {
    const hideMapboxChildren = () => {
      if (mapContainerRef.current) {
        const mapboxChildrenDiv = mapContainerRef.current.querySelector(
          'div[mapboxgl-children]'
        );
        if (mapboxChildrenDiv) {
          (mapboxChildrenDiv as HTMLElement).style.display = 'none';
        }
      }
    };

    // Try to hide immediately
    hideMapboxChildren();

    // Set up a MutationObserver to watch for the element being added
    const observer = new MutationObserver(() => {
      hideMapboxChildren();
    });

    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <AutoSizer>
      {({ width = 480, height = 480 }) => (
        <div
          ref={mapContainerRef}
          className="MapContainer"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            position: 'relative',
          }}
        >
          <style>
            {`
              .MapContainer div[mapboxgl-children] {
                display: none !important;
              }
            `}
          </style>
          <MapViewStateContextProvider mapState={newMapState}>
            <MapContainer
              width={width}
              height={height}
              primary={true}
              key={mapIndex}
              index={mapIndex}
              containerId={mapIndex}
              theme={keplerTheme}
              {...mapFields}
            />
          </MapViewStateContextProvider>
        </div>
      )}
    </AutoSizer>
  );
}
