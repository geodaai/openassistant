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
} from '@openassistant/geoda';
import { SAMPLE_DATASETS } from './dataset';
import { think } from '@openassistant/core';
import { PointLayerData } from '@geoda/core';

export default function App() {
  const getValues = async (datasetName: string, variableName: string) => {
    return (SAMPLE_DATASETS[datasetName] as any[]).map(
      (item) => item[variableName]
    );
  };

  const getGeometries: GetGeometries = async (datasetName: string) => {
    // get points in [longitude, latitude] array format from dataset
    const points: PointLayerData[] = SAMPLE_DATASETS[datasetName].map(
      (item, index) => ({
        position: [item.longitude, item.latitude],
        index,
        neighbors: [],
      })
    );
    return points;
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

  const tools = {
    think,
    dataClassify: classifyTool,
    spatialWeights: weightsTool,
    globalMoran: globalMoranTool,
  };
  const welcomeMessage = `
Welcome to the GeoDa Tools Example!

For example,

1. classify the population data into 5 classes using natural breaks classification
2. create a queen contiguity weights
3. create a moran scatter plot of the population data
4. Can you help me analyze the spatial autocorrelation of population data
`;

  const instructions = `
You are a helpful assistant. Please try to use the provided tools to solve the problem.

Please use the following datasets:

datasetName: myVenues
variables:
- location
- latitude
- longitude
- revenue
- population
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
