import { openai } from '@ai-sdk/openai';
import { getDuckDBTool } from '@openassistant/duckdb';
import { getPlotsTool } from '@openassistant/plots';
import {
  getGeoDaTool,
  GeoDaToolNames,
  GetGeometries,
} from '@openassistant/geoda';
import { getOsmTool, OsmToolNames } from '@openassistant/osm';
import { getMapTool, MapToolNames } from '@openassistant/map';
import { createDataStreamResponse, streamText } from 'ai';

export async function POST(req: Request) {
  const systemPrompt = `You are a helpful assistant that can answer questions and help with tasks. 
You can use the following datasets:
- datasetName: natregimes
- variables: [HR60, PO60, latitude, longitude]
- datasetName: world_countries
- variables: [id, latitude, longitude]
`;

  let toolAdditionalData: Record<string, unknown> = {};

  // context for server-side tools
  const getValues = async (datasetName: string, variableName: string) => {
    console.log('getValues', datasetName, variableName);
    // simulate a server-side function that returns a list of values from a dataset
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  };

  const getGeometries: GetGeometries = async (datasetName: string) => {
    console.log('getGeometries', datasetName);
    // simulate a server-side function that returns a list of geometries from a dataset
    // return a list of point features coordinates in chandler, arizona
    const points = [
      [111.96625, 33.30202],
      [111.97234, 33.29876],
      [111.96018, 33.30543],
      [111.97562, 33.30115],
      [111.95891, 33.29987],
      [111.96945, 33.30421],
      [111.96378, 33.29765],
      [111.97123, 33.30389],
      [111.95734, 33.30198],
      [111.96812, 33.29934],
    ];
    return points.map((point, index) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: point,
      },
      properties: { id: index + 1 },
    }));
  };

  const onToolCompleted = (toolCallId: string, toolOutput?: unknown) => {
    if (toolOutput) {
      // pass the server-side tool output to client for tool rendering in browser (if needed)
      toolAdditionalData[toolCallId] = toolOutput;
      console.log('toolAdditionalData', toolAdditionalData);
    }
  };

  // create a client-side tool for downloadMapData
  const downloadMapDataTool = getMapTool(MapToolNames.downloadMapData, {
    toolContext: {},
    isExecutable: false,
  });

  // create a client-side tool for leaflet
  const leafletTool = getMapTool(MapToolNames.leaflet, {
    toolContext: {
      getGeometries,
    },
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
    toolContext: { getValues },
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
          if (Object.keys(toolAdditionalData).length > 0) {
            // add tool output (additionalData) to message annotation which returns back to client
            // @ts-expect-error - toolAdditionalData is a record of unknown values
            dataStream.writeMessageAnnotation(toolAdditionalData);
            // clean up toolAdditionalData
            toolAdditionalData = {};
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
