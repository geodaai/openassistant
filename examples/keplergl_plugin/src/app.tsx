import { AiAssistant } from '@openassistant/ui';
import {
  createMapFunctionDefinition,
  GetDatasetForCreateMapFunctionArgs,
} from '@openassistant/keplergl';

const SAMPLE_DATA = {
  myVenues: [
    {
      name: 'venue 1',
      longitude: -73.99389648,
      latitude: 40.75011063,
      revenue: 1000000,
      population: 1000000,
    },
    {
      name: 'venue 2',
      longitude: -73.97642517,
      latitude: 40.73981094,
      revenue: 2000000,
      population: 2000000,
    },
    {
      name: 'venue 3',
      longitude: -73.96870422,
      latitude: 40.75424576,
      revenue: 3000000,
      population: 3000000,
    },
    {
      name: 'venue 4',
      longitude: -73.95987634,
      latitude: 40.76012845,
      revenue: 4000000,
      population: 4000000,
    },
    {
      name: 'venue 5',
      longitude: -73.9654321,
      latitude: 40.75789321,
      revenue: 5000000,
      population: 5000000,
    },
  ],
};

export function App() {
  const functions = [
    createMapFunctionDefinition({
      getDataset: ({ datasetName }: GetDatasetForCreateMapFunctionArgs) => {
        // check if the dataset exists
        if (!SAMPLE_DATA[datasetName]) {
          throw new Error('The dataset does not exist.');
        }
        return SAMPLE_DATA[datasetName];
      },
    }),
  ];

  const instructions = `You are a data and map analyst. You can help users to create a map from a dataset.
If a function calling can be used to answer the user's question, please always confirm the function calling and its arguments with the user.

Here is the dataset are available for function calling:
DatasetName: myVenues
Fields: name, longitude, latitude, revenue, population`;

  const welcomeMessage = `
  Welcome to the Kepler.gl Tool Example! You can ask me to create a map from a dataset. Try to use the createMap tool to create the map. For example,

  1. create a map of the myVenues dataset
  2. create a map of the myVenues dataset with the revenue as the color
  3. create a map of the myVenues dataset with the population as the size
  `;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Kepler.gl Tool Example</h1>
        <div className="rounded-lg shadow-lg p-6 h-[800px]">
          <AiAssistant
            name="Kepler.gl Tool"
            modelProvider="openai"
            model="gpt-4o"
            apiKey={process.env.OPENAI_API_KEY || ''}
            welcomeMessage={welcomeMessage}
            instructions={instructions}
            functions={functions}
            useMarkdown={true}
          />
        </div>
      </div>
    </div>
  );
}
