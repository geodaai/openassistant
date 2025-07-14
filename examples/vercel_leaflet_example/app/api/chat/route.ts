// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { openai } from '@ai-sdk/openai';
import { createDataStreamResponse, streamText } from 'ai';
import {
  convertToVercelAiTool,
  getValuesFromGeoJSON,
} from '@openassistant/utils';
import {
  dataClassify,
  GetGeometries,
  lisa,
  spatialWeights,
} from '@openassistant/geoda';
import { leaflet, downloadMapData } from '@openassistant/map';
import { isochrone, geocoding, routing } from '@openassistant/osm';
import { localQuery } from '@openassistant/duckdb';
import { histogram } from '@openassistant/plots';

// Move toolAdditionalData outside the POST function to persist across requests
const toolAdditionalData: { toolCallId: string; data: unknown }[] = [];

let wasToolCalled = false;

const systemPrompt = `You are a helpful assistant that can answer questions and help with tasks. 
You can use the following datasets:
- datasetName: natregimes
- variables: [HR60, PO60, latitude, longitude]
- datasetName: world_countries
- variables: [id, latitude, longitude]
`;

// context for server-side tools
const getValues = async (
  datasetName: string,
  variableName: string
): Promise<number[]> => {
  console.log('getValues', datasetName, variableName);
  for (const toolData of toolAdditionalData) {
    const data = toolData.data;
    if (data && typeof data === 'object' && datasetName in data) {
      const cache = (data as Record<string, unknown>)[datasetName];
      if (cache) {
        const values = await getValuesFromGeoJSON(
          cache as GeoJSON.FeatureCollection,
          variableName
        );
        console.log('cache', values);
        return values as number[];
      }
    }
  }
  return [];
};

const getGeometries: GetGeometries = async (datasetName: string) => {
  console.log('getGeometries', datasetName);
  for (const toolData of toolAdditionalData) {
    const data = toolData.data;
    if (data && typeof data === 'object' && datasetName in data) {
      const cache = (data as Record<string, unknown>)[datasetName];
      if (cache) {
        const geojson = cache as GeoJSON.FeatureCollection;
        // return a copy with empty the properties of each feature
        return geojson.features.map((feature) => {
          return {
            ...feature,
            properties: {},
          };
        });
      }
    }
  }
  return null;
};

const onToolCompleted = (toolCallId: string, toolOutput?: unknown) => {
  if (toolOutput) {
    toolAdditionalData.push({ toolCallId, data: toolOutput });
    wasToolCalled = true;
    console.log('🗺️ toolAdditionalData', toolAdditionalData);
  }
};

// client-side tools
const leafletTool = convertToVercelAiTool(leaflet, {
  isExecutable: false,
});
const localQueryTool = convertToVercelAiTool(localQuery, {
  isExecutable: false,
});

// server-side tools
const downloadMapDataTool = convertToVercelAiTool({
  ...downloadMapData,
  onToolCompleted,
});
const geocodingTool = convertToVercelAiTool({
  ...geocoding,
  onToolCompleted,
});
const routingTool = convertToVercelAiTool({
  ...routing,
  context: {
    getMapboxToken: () => process.env.MAPBOX_TOKEN!,
  },
  onToolCompleted,
});
const isochroneTool = convertToVercelAiTool({
  ...isochrone,
  context: {
    getMapboxToken: () => process.env.MAPBOX_TOKEN!,
  },
  onToolCompleted,
});

const dataClassifyTool = convertToVercelAiTool({
  ...dataClassify,
  context: { getValues },
  onToolCompleted,
});

const spatialWeightsTool = convertToVercelAiTool({
  ...spatialWeights,
  context: { getGeometries },
  onToolCompleted,
});

const lisaTool = convertToVercelAiTool({
  ...lisa,
  context: { getValues, getGeometries },
  onToolCompleted,
});

const histogramTool = convertToVercelAiTool({
  ...histogram,
  context: { getValues },
  onToolCompleted,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: openai('gpt-4o'),
        messages: messages,
        system: systemPrompt,
        tools: {
          downloadMapData: downloadMapDataTool,
          leaflet: leafletTool,
          geocoding: geocodingTool,
          routing: routingTool,
          isochrone: isochroneTool,
          classifyData: dataClassifyTool,
          spatialWeights: spatialWeightsTool,
          lisa: lisaTool,
          localQuery: localQueryTool,
          histogram: histogramTool,
        },
        onFinish() {
          // Only write tool data if a tool was actually called
          if (wasToolCalled && toolAdditionalData.length > 0) {
            const lastToolData =
              toolAdditionalData[toolAdditionalData.length - 1];
            console.log('write toolData back to client', lastToolData);
            // @ts-expect-error - toolAdditionalData is a record of unknown values
            dataStream.writeMessageAnnotation(lastToolData);
            wasToolCalled = false;
          }
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (error) => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });
}
