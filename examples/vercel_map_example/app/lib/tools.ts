// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { localQuery } from '@openassistant/duckdb';
import { histogram } from '@openassistant/plots';
import { GetGeometries } from '@openassistant/geoda';
import { geocoding, routing, isochrone } from '@openassistant/osm';
import { dataClassify, spatialWeights, lisa } from '@openassistant/geoda';
import { downloadMapData, keplergl } from '@openassistant/map';
import {
  getValuesFromGeoJSON,
  convertToVercelAiTool,
  ToolOutputManager,
} from '@openassistant/utils';

// Helper function to get values from dataset
const createGetValues = (toolOutputManager: ToolOutputManager) => 
  async (datasetName: string, variableName: string) => {
    console.log('getValues', datasetName, variableName);
    // your own code to get values from a dataset

    // or, check GeoJson data cached by the ToolOutputManager
    const cachedData =
      await toolOutputManager.findDataByDatasetName(datasetName);
    if (cachedData) {
      const values = await getValuesFromGeoJSON(
        cachedData as GeoJSON.FeatureCollection,
        variableName
      );
      console.log('cache', values);
      return values as number[];
    }

    throw new Error(
      `No values found for datasetName: ${datasetName} and variableName: ${variableName}`
    );
  };

// Helper function to get geometries from dataset  
const createGetGeometries = (toolOutputManager: ToolOutputManager): GetGeometries => 
  async (datasetName: string) => {
    console.log('getGeometries', datasetName);
    // your own code to get geometries from a dataset

    // or, check GeoJson data cached by the ToolOutputManager
    const cachedData =
      await toolOutputManager.findDataByDatasetName(datasetName);
    if (cachedData) {
      const geojson = cachedData as GeoJSON.FeatureCollection;
      // return a copy with empty the properties of each feature
      return geojson.features.map((feature) => {
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
  const getValues = createGetValues(toolOutputManager);
  const getGeometries = createGetGeometries(toolOutputManager);

  // Client-side tools (not executable on server)
  const keplerglTool = convertToVercelAiTool(keplergl, {
    isExecutable: false,
  });

  const localQueryTool = convertToVercelAiTool(localQuery, {
    isExecutable: false,
  });

  // Server-side tools (executable with tool output caching)
  const downloadMapDataTool = convertToVercelAiTool({
    ...downloadMapData,
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

  const dataClassifyTool = convertToVercelAiTool({
    ...dataClassify,
    context: { getValues },
    onToolCompleted: toolOutputManager.createOnToolCompletedCallback(),
  });

  const spatialWeightsTool = convertToVercelAiTool({
    ...spatialWeights,
    context: { getGeometries },
    onToolCompleted: toolOutputManager.createOnToolCompletedCallback(),
  });

  const lisaTool = convertToVercelAiTool({
    ...lisa,
    context: { getValues, getGeometries },
    onToolCompleted: toolOutputManager.createOnToolCompletedCallback(),
  });

  const histogramTool = convertToVercelAiTool({
    ...histogram,
    context: { getValues },
    onToolCompleted: toolOutputManager.createOnToolCompletedCallback(),
  });

  return {
    downloadMapData: downloadMapDataTool,
    keplergl: keplerglTool,
    geocoding: geocodingTool,
    routing: routingTool,
    isochrone: isochroneTool,
    classifyData: dataClassifyTool,
    spatialWeights: spatialWeightsTool,
    lisa: lisaTool,
    localQuery: localQueryTool,
    histogram: histogramTool,
  };
} 