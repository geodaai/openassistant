import { openai } from '@ai-sdk/openai';
import { getDuckDBTool } from 'packages/tools/duckdb/dist';
import { getPlotsTool } from 'packages/tools/plots/dist';
import {
  getGeoDaTool,
  GeoDaToolNames,
  GetGeometries,
} from 'packages/tools/geoda/dist';
import { getOsmTool, OsmToolNames } from 'packages/tools/osm/dist';
import {
  getMapTool,
  getValuesFromGeoJSON,
  MapToolNames,
} from 'packages/tools/map/dist';
import { createDataStreamResponse, streamText } from 'ai';

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

// create a client-side tool for downloadMapData
const downloadMapDataTool = getMapTool(MapToolNames.downloadMapData, {
  toolContext: {},
  onToolCompleted,
  isExecutable: true,
});

// create a client-side tool for leaflet
const leafletTool = getMapTool(MapToolNames.leaflet, {
  toolContext: {},
  isExecutable: false,
});

// create a server-side tool for geocoding: no context needed (runs in server)
const geocodingTool = getOsmTool(OsmToolNames.geocoding, {
  onToolCompleted,
  isExecutable: true,
});

// create a server-side tool for routing: you need to provide a tool context (runs in server)
const routingTool = getOsmTool(OsmToolNames.routing, {
  toolContext: {
    getMapboxToken: () => process.env.MAPBOX_TOKEN!,
  },
  onToolCompleted,
  isExecutable: true,
});

// create a server-side tool for isochrone: you need to provide a tool context (runs in server)
const isochroneTool = getOsmTool(OsmToolNames.isochrone, {
  toolContext: {
    getMapboxToken: () => process.env.MAPBOX_TOKEN!,
  },
  onToolCompleted,
  isExecutable: true,
});

// create a server-side tool for classifyData (runs in server)
const dataClassifyTool = getGeoDaTool(GeoDaToolNames.dataClassify, {
  toolContext: { getValues },
  onToolCompleted,
  isExecutable: true,
});

// create a server-side tool for spatialWeights (runs in server)
const spatialWeightsTool = getGeoDaTool(GeoDaToolNames.spatialWeights, {
  toolContext: { getGeometries },
  onToolCompleted,
  isExecutable: true,
});

// create a server-side tool for lisa (runs in server)
const lisaTool = getGeoDaTool(GeoDaToolNames.lisa, {
  toolContext: { getValues, getGeometries },
  onToolCompleted,
  isExecutable: true,
});

// create a client-side tool for local query (runs in browser)
const localQueryTool = getDuckDBTool('localQuery', {
  isExecutable: false,
});

// create a server-side tool for histogram
const histogramTool = getPlotsTool('histogram', {
  toolContext: { getValues },
  onToolCompleted,
  isExecutable: true,
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
