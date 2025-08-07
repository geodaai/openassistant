// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { geotagging, placeSearch } from '@openassistant/places';
import { geocoding, routing, isochrone } from '@openassistant/osm';
import { buffer } from '@openassistant/geoda';
import { downloadMapData, keplergl } from '@openassistant/map';
import {
  convertToVercelAiTool,
  ToolOutputManager,
} from '@openassistant/utils';

// Helper function to get geometries from dataset
const createGetGeometries =
  (toolOutputManager: ToolOutputManager) => async (datasetName: string) => {
    console.log('getGeometries', datasetName);
    // check GeoJson data cached by the ToolOutputManager
    const cachedData =
      await toolOutputManager.findDataByDatasetName(datasetName);
    if (cachedData) {
      const geojson = cachedData as any;
      // return a copy with empty the properties of each feature
      return geojson.features.map((feature: any) => {
        return {
          ...feature,
          properties: {},
        };
      });
    }

    return null;
  };

/**
 * Creates and returns all the tools configured for the chat API
 */
export function createTools(toolOutputManager: ToolOutputManager) {
  const getGeometries = createGetGeometries(toolOutputManager);

  // Client-side tools (not executable on server)
  const keplerglTool = convertToVercelAiTool(keplergl, {
    isExecutable: false,
  });

  // Server-side tools (executable with tool output caching)
  const downloadMapDataTool = convertToVercelAiTool({
    ...downloadMapData,
    onToolCompleted: toolOutputManager.createOnToolCompletedCallback(),
  });

  const geotaggingTool = convertToVercelAiTool({
    ...geotagging,
    context: {
      getFsqToken: () => process.env.FSQ_TOKEN!,
    },
    onToolCompleted: toolOutputManager.createOnToolCompletedCallback(),
  });

  const placeSearchTool = convertToVercelAiTool({
    ...placeSearch,
    context: {
      getFsqToken: () => process.env.FSQ_TOKEN!,
    },
    onToolCompleted: toolOutputManager.createOnToolCompletedCallback(),
  });

  const geocodingTool = convertToVercelAiTool({
    ...geocoding,
    onToolCompleted: toolOutputManager.createOnToolCompletedCallback(),
  });

  const routingTool = convertToVercelAiTool({
    ...routing,
    context: {
      getMapboxToken: () => process.env.MAPBOX_TOKEN!,
    },
    onToolCompleted: toolOutputManager.createOnToolCompletedCallback(),
  });

  const isochroneTool = convertToVercelAiTool({
    ...isochrone,
    context: {
      getMapboxToken: () => process.env.MAPBOX_TOKEN!,
    },
    onToolCompleted: toolOutputManager.createOnToolCompletedCallback(),
  });

  const bufferTool = convertToVercelAiTool({
    ...buffer,
    context: { getGeometries },
    onToolCompleted: toolOutputManager.createOnToolCompletedCallback(),
  });

  return {
    downloadMapData: downloadMapDataTool,
    keplergl: keplerglTool,
    geotagging: geotaggingTool,
    placeSearch: placeSearchTool,
    geocoding: geocodingTool,
    routing: routingTool,
    isochrone: isochroneTool,
    buffer: bufferTool,
  };
}
