import { useEffect, useMemo } from 'react';
import { AiAssistant } from '@openassistant/ui';
import { useAssistant } from '@openassistant/core';
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

const INSTRUCTIONS = `
You are a data and map analyst. You can help users to create a map from a dataset.
If a function calling can be used to answer the user's question, please always confirm the function calling and its arguments with the user.

Here is the dataset are available for function calling:
DatasetName: myVenues
Fields: name, longitude, latitude, revenue, population
`;

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

  const assistantProps = {
    name: 'My AI Assistant',
    description: 'This is my AI assistant',
    version: '1.0.0',
    modelProvider: 'openai',
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_TOKEN || '',
    welcomeMessage: 'Hi, I am your AI assistant',
    instructions: INSTRUCTIONS,
    functions,
    useMarkdown: true,
  };

  const dataContext = useMemo(() => {
    // Note: you can call your data API to get the meta data of your dataset
    return [
      {
        description: 'Please use the following datasets for function callings.',
        metaData: [
          {
            datasetName: 'myVenues',
            fields: ['name', 'longitude', 'latitude', 'revenue', 'population'],
          },
        ],
      },
    ];
  }, []);

  const { initializeAssistant, addAdditionalContext } =
    useAssistant(assistantProps);

  // initialize assistant with context
  const initializeAssistantWithContext = async () => {
    await initializeAssistant();
    addAdditionalContext({ context: JSON.stringify(dataContext) });
  };

  useEffect(() => {
    // Note: when your dataContext is updated, this will trigger the assistant to update the context
    initializeAssistantWithContext();
  }, [dataContext, addAdditionalContext]);

  return (
    <div className="w-[400px] h-[800px] m-4">
      <AiAssistant {...assistantProps} functions={functions} />
    </div>
  );
}
