import { AiAssistant } from '@openassistant/ui';
import {
  dataClassify,
  DataClassifyTool,
  spatialWeights,
  SpatialWeightsTool,
  GetGeometries,
  SpatialWeightsToolComponent,
  globalMoran,
  GlobalMoranTool,
  MoranScatterPlotToolComponent,
  spatialRegression,
  SpatialRegressionTool,
  lisa,
  LisaTool,
  spatialJoin,
  SpatialJoinTool,
  buffer,
} from '@openassistant/geoda';
import {
  geocoding,
  routing,
  getUsStateGeojson,
  getUsZipcodeGeojson,
  getUsCountyGeojson,
  getCachedData,
} from '@openassistant/osm';
import { keplergl, KeplerglTool } from '@openassistant/keplergl';

import { PointLayerData } from '@geoda/core';
import { SAMPLE_DATASETS } from './dataset';

export default function App() {
  const getValues = async (datasetName: string, variableName: string) => {
    return (SAMPLE_DATASETS[datasetName] as any[]).map(
      (item) => item[variableName]
    );
  };

  const getGeometries: GetGeometries = async (datasetName: string) => {
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
    const geoms = getCachedData(datasetName);
    if (geoms && 'features' in geoms && geoms.features.length > 0) {
      return geoms.features;
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
    component: SpatialWeightsToolComponent,
  };

  const globalMoranTool: GlobalMoranTool = {
    ...globalMoran,
    context: {
      ...globalMoran.context,
      getValues,
    },
    component: MoranScatterPlotToolComponent,
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
    },
  };

  const spatialJoinTool: SpatialJoinTool = {
    ...spatialJoin,
    context: {
      ...spatialJoin.context,
      getValues,
      getGeometries,
    },
  };

  const getUsStateGeojsonTool = {
    ...getUsStateGeojson,
  };

  const getMapData = async (datasetName: string) => {
    let result;

    const geoms = getCachedData(datasetName);
    if (geoms) {
      result = geoms;
    }

    return result;
  };

  const createMap: KeplerglTool = {
    ...keplergl,
    context: {
      ...keplergl.context,
      getGeometries: getMapData,
    },
  };

  const routingTool = {
    ...routing,
    context: {
      ...routing.context,
      getGraphHopperApiKey: () => process.env.GRAPHHOPPER_API_KEY || '',
    },
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
    buffer,
    createMap,
    routing: routingTool,
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
    <div className="min-h-screen p-4">
      <div className="mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">GeoDa Tools Example</h1>
        <div className="rounded-lg shadow-lg p-6 h-[800px]">
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
    </div>
  );
}
