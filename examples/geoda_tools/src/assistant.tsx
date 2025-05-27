import { AiAssistant } from '@openassistant/ui';
import { MoranScatterComponent } from '@openassistant/echarts';
import { SpatialWeightsComponent } from '@openassistant/tables';
import {
  dataClassify,
  DataClassifyTool,
  spatialWeights,
  SpatialWeightsTool,
  GetGeometries,
  globalMoran,
  GlobalMoranTool,
  spatialRegression,
  SpatialRegressionTool,
  lisa,
  LisaTool,
  spatialJoin,
  SpatialJoinTool,
  buffer,
  BufferTool,
} from '@openassistant/geoda';
import {
  geocoding,
  routing,
  getUsStateGeojson,
  getUsZipcodeGeojson,
  getUsCountyGeojson,
  RoutingTool,
  roads,
  RoadsTool,
} from '@openassistant/osm';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { GetDataset, keplergl, KeplerglTool } from '@openassistant/map';
import { useToolCache } from '@openassistant/core';
import { getValuesFromGeoJSON } from '@openassistant/utils';

import { PointLayerData } from '@geoda/core';
import { SAMPLE_DATASETS } from './dataset';

function isGeoJson(obj: unknown): obj is GeoJSON.FeatureCollection {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'type' in obj &&
    obj.type === 'FeatureCollection'
  );
}

export default function AiChat() {
  const { toolCache, updateToolCache } = useToolCache();

  // use onToolCompleted to cache datasets from some tools
  const onToolCompleted = (toolCallId: string, additionalData: unknown) => {
    // find the dataset from the tool results and cache it
    updateToolCache(toolCallId, additionalData);
  };

  const getValues = async (datasetName: string, variableName: string) => {
    if (datasetName === 'myVenues') {
      return (SAMPLE_DATASETS[datasetName] as any[]).map(
        (item) => item[variableName]
      );
    }
    // get cached values from other tools
    if (toolCache[datasetName]) {
      const data = toolCache[datasetName];
      if (isGeoJson(data)) {
        return getValuesFromGeoJSON(data, variableName) as any[];
      }
    }
    throw new Error(`Dataset ${datasetName} not found`);
  };

  const getGeometries: GetGeometries = async (datasetName: string) => {
    // user provided geometries
    if (datasetName === 'myVenues') {
      // get points in [longitude, latitude] array format from dataset
      const points: PointLayerData[] = SAMPLE_DATASETS[datasetName].map(
        (item, index) => ({
          position: [item.longitude, item.latitude],
          index,
          neighbors: [],
        })
      );
      return points;
    }
    // get cached geometries from other tools
    if (toolCache[datasetName]) {
      const data = toolCache[datasetName];
      if (isGeoJson(data)) {
        return data.features;
      }
    }

    throw new Error(`Dataset ${datasetName} not found`);
  };

  const getDataset: GetDataset = async (datasetName: string) => {
    if (datasetName === 'myVenues') {
      return SAMPLE_DATASETS[datasetName];
    }
    // get cached geometries from other tools
    if (toolCache[datasetName]) {
      const data = toolCache[datasetName];
      if (data) {
        return data;
      }
    }
    throw new Error(`Dataset ${datasetName} not found`);
  };

  // Configure the dataClassify tool
  const classifyTool: DataClassifyTool = {
    ...dataClassify,
    context: {
      ...dataClassify.context,
      getValues,
    },
  };

  const weightsTool: SpatialWeightsTool = {
    ...spatialWeights,
    context: {
      ...spatialWeights.context,
      getGeometries,
    },
    component: SpatialWeightsComponent,
  };

  const globalMoranTool: GlobalMoranTool = {
    ...globalMoran,
    context: {
      ...globalMoran.context,
      getValues,
    },
    component: MoranScatterComponent,
  };

  const regressionTool: SpatialRegressionTool = {
    ...spatialRegression,
    context: {
      ...spatialRegression.context,
      getValues,
    },
  };

  const lisaTool: LisaTool = {
    ...lisa,
    context: {
      ...lisa.context,
      getValues,
      getGeometries,
    },
    onToolCompleted,
  };

  const spatialJoinTool: SpatialJoinTool = {
    ...spatialJoin,
    context: {
      ...spatialJoin.context,
      getValues,
      getGeometries,
    },
    onToolCompleted,
  };

  const getUsStateGeojsonTool = {
    ...getUsStateGeojson,
    onToolCompleted,
  };

  const keplerglTool: KeplerglTool = {
    ...keplergl,
    context: {
      ...keplergl.context,
      getDataset,
    },
    component: KeplerGlComponent,
  };

  const routingTool: RoutingTool = {
    ...routing,
    context: {
      ...routing.context,
      getMapboxToken: () => process.env.MAPBOX_TOKEN || '',
    },
    onToolCompleted,
  };

  const bufferTool: BufferTool = {
    ...buffer,
    context: {
      ...buffer.context,
      getGeometries,
    },
    onToolCompleted,
  };

  const roadsTool: RoadsTool = {
    ...roads,
    context: {
      ...roads.context,
      getGeometries,
    },
    onToolCompleted,
  };

  const tools = {
    dataClassify: classifyTool,
    spatialWeights: weightsTool,
    globalMoran: globalMoranTool,
    spatialRegression: regressionTool,
    lisa: lisaTool,
    spatialJoin: spatialJoinTool,
    getUsStateGeojson: getUsStateGeojsonTool,
    getUsZipcodeGeojson,
    getUsCountyGeojson,
    geocoding,
    buffer: bufferTool,
    keplergl: keplerglTool,
    routing: routingTool,
    roads: roadsTool,
  };

  const welcomeMessage = `
Hi! I'm your GeoDa assistant. Here are some example queries you can try:

1. How can I classify the population data into 5 classes using natural breaks?
2. Could you help me create a queen contiguity weights?
3. Can you help me analyze the spatial autocorrelation of population data?
4. Can you run an OLS regression to analyze how population and income affect revenue?
5. Do I need a spatial regression model?
6. Can you help to check the spatial patterns of the revenue data?
7. How many venues are there in California and Texas?
8. What are the total revenue in California and Texas?
9. How can I geocode the address "123 Main St, San Francisco, CA"?
10. How can I buffer the address "123 Main St, San Francisco, CA" by 10 KM?
11. How can I get the routing directions between "123 Main St, San Francisco, CA" and "450 10th St, San Francisco, CA 94103"?
12. Can I get the road network in zipcode 85248?
`;

  const instructions = `
You are a helpful assistant.
Note:
- For EVERY question, including follow-up questions and subsequent interactions, you MUST ALWAYS:
  1. First, make a detailed plan to answer the question
  2. Explicitly outline this plan in your response
  3. Only AFTER showing the plan, proceed with any tool calls
  4. Never make tool calls before presenting your plan
  5. This requirement applies to ALL questions, regardless of whether they are initial or follow-up questions
- Please try to use the provided tools to solve the problem.
- If the tools are missing parameters, please ask the user to provide the parameters.
- If the tools are failed, please try to fix the error and return the reason to user in a markdown format.
- Please use the following datasets:
  - datasetName: myVenues
    variables:
    - location
    - latitude
    - longitude
    - revenue
    - population
    - income
`;

  return (
    <div className="min-w-80 w-full px-4 py-8">
      <div className="rounded-lg shadow-lg h-[calc(100vh-100px)] w-full">
        <AiAssistant
          name="GeoDa Assistant"
          modelProvider="openai"
          model="gpt-4o"
          apiKey={process.env.OPENAI_API_KEY || ''}
          tools={tools}
          welcomeMessage={welcomeMessage}
          instructions={instructions}
          theme="dark"
        />
      </div>
    </div>
  );
}
