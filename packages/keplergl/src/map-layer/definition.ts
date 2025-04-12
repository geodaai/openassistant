'use client';

import {
  RegisterFunctionCallingProps,
  CustomFunctionContext,
} from '@openassistant/core';
import { CreateMapCallbackFunction } from './callback-function';
import { KeplerGlToolComponent } from './component/keplergl-component';

export type GetDatasetForCreateMapFunctionArgs = {
  datasetName: string;
};

/**
 * The context for the createMap function.
 * @param getDataset - The function to get the dataset.
 * @param config - The configuration of the map.
 * @param config.isDraggable - Whether the map is draggable.
 * @param config.theme - The theme of the map.
 */
export type MapLayerFunctionContext = {
  getDataset: ({
    datasetName,
  }: GetDatasetForCreateMapFunctionArgs) => Promise<unknown>;
  config?: { isDraggable?: boolean; theme?: string };
};

type ValueOf<T> = T[keyof T];
export type MapLayerFunctionContextValues = ValueOf<MapLayerFunctionContext>;

/**
 * createMapFunctionDefinition is a function that creates a map function definition.
 * @param context - The context for the function. See {@link CustomFunctionContext} for more information.
 * @returns The map function definition.
 */
export function createMapFunctionDefinition(
  context: CustomFunctionContext<MapLayerFunctionContextValues>
): RegisterFunctionCallingProps {
  return {
    name: 'createMap',
    description: 'Create a map with Kepler.gl',
    properties: {
      datasetName: {
        type: 'string',
        description: 'The name of the dataset',
      },
      geometryColumn: {
        type: 'string',
        description: 'The name of the geometry column. (optional)',
      },
      latitudeColumn: {
        type: 'string',
        description: 'The name of the latitude column. (optional)',
      },
      longitudeColumn: {
        type: 'string',
        description: 'The name of the longitude column. (optional)',
      },
      mapType: {
        type: 'string',
        description:
          'The type of the map. e.g. "point", "line", "arc", "polygon", "heatmap", "hexbin", "h3". (optional)',
      },
    },
    required: ['datasetName'],
    callbackFunction: CreateMapCallbackFunction,
    callbackFunctionContext: context,
    // @ts-expect-error - deprecated
    callbackMessage: KeplerGlToolComponent,
  };
}

