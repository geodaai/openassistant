import { AiAssistant } from '@openassistant/ui';
import {
  dataClassify,
  DataClassifyTool,
  spatialWeights,
  SpatialWeightsTool,
} from '@openassistant/geoda';
import { SAMPLE_DATASETS } from './dataset';
import { think } from '@openassistant/core';

export default function App() {
  const getValues = async (datasetName: string, variableName: string) => {
    return (SAMPLE_DATASETS[datasetName] as any[]).map(
      (item) => item[variableName]
    );
  };

  const getGeometries = async (datasetName: string) => {
    // get points in [longitude, latitude] array format from dataset
    const points: [number, number][] = SAMPLE_DATASETS[datasetName].map(
      (item) => [item.longitude, item.latitude]
    );
    return {
      type: 'points' as const,
      points,
    };
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
  };

  const tools = {
    think,
    dataClassify: classifyTool,
    spatialWeights: weightsTool,
  };
  const welcomeMessage = `
Welcome to the GeoDa Tools Example!

For example,

1. classify the population data into 5 classes using equal interval classification
2. classify the population data into 5 classes using natural breaks classification
3. classify the population data into 5 classes using quantile classification
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
          />
        </div>
      </div>
    </div>
  );
}
