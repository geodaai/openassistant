import React from 'react';
import { AiAssistant } from '@openassistant/ui';
import { keplergl, KeplerglTool } from '@openassistant/keplergl';
import '@openassistant/ui/dist/index.css';
import { SAMPLE_DATASETS } from './dataset';

export function App() {
  // const functions = [
  //   createMapFunctionDefinition({
  //     getDataset: async ({
  //       datasetName,
  //     }: GetDatasetForCreateMapFunctionArgs) => {
  //       // check if the dataset exists
  //       if (!SAMPLE_DATASETS[datasetName]) {
  //         throw new Error('The dataset does not exist.');
  //       }
  //       return SAMPLE_DATASETS[datasetName];
  //     },
  //   }),
  // ];
  const keplerglTool: KeplerglTool = {
    ...keplergl,
    context: {
      ...keplergl.context,
      getDataset: async ({ datasetName }) => SAMPLE_DATASETS[datasetName],
      config: {
        isDraggable: false,
      },
    },
  };

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
            tools={{ keplergl: keplerglTool }}
            useMarkdown={true}
          />
        </div>
      </div>
    </div>
  );
}
