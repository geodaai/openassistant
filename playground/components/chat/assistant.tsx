'use client';

import {
  createMapFunctionDefinition,
  GetDatasetForCreateMapFunctionArgs,
} from '@openassistant/keplergl';
import {
  computeRegression,
  ScatterplotComponent,
  ScatterplotOutputData,
} from '@openassistant/echarts';
import { useMemo, useState } from 'react';
import { MessageModel, useAssistant } from '@openassistant/core';
import { AiAssistant, AiAssistantConfig, ConfigPanel } from '@openassistant/ui';
import { ExpandableContainer } from '@openassistant/common';
import { queryDuckDBFunctionDefinition } from '@openassistant/duckdb';
import { SAMPLE_DATASETS } from './dataset';

const SCATTERPLOT_DATA = {
  xVariableName: 'X Variable',
  yVariableName: 'Y Variable',
  xData: [
    1, 2.3, 3.1, 4.2, 5.5, 6.1, 7.3, 8.4, 9.2, 10.1, 11.5, 12.2, 13.4, 14.7,
    15.1, 16.3, 17.8, 18.2, 19.5, 20,
  ],
  yData: [
    2.1, 3.8, 4.2, 5.1, 5.8, 6.7, 7.2, 7.8, 8.9, 9.3, 8.7, 10.2, 11.5, 10.8,
    12.3, 13.1, 14.2, 13.8, 15.2, 14.9,
  ],
  datasetName: 'sample',
  onSelected: (datasetName: string, indexes: number[]) => {
    console.log('Selected:', datasetName, indexes);
  },
  filteredIndex: [],
  showLoess: false,
  showRegressionLine: true,
};

const regressionResults = computeRegression({
  xData: SCATTERPLOT_DATA.xData,
  yData: SCATTERPLOT_DATA.yData,
  filteredIndex: SCATTERPLOT_DATA.filteredIndex,
});

export default function Assistant({
  screenCaptured,
  setScreenCaptured,
  setStartScreenCapture,
}: {
  screenCaptured: string;
  setScreenCaptured: (screenCaptured: string) => void;
  setStartScreenCapture: (startScreenCapture: boolean) => void;
}) {
  const dataContext = useMemo(() => {
    // Note: you can call your data API to get the meta data of your dataset
    return [
      {
        description:
          'Here are the meta data of datasets you can use in data analysis:',
        metaData: [
          {
            datasetName: 'myVenues',
            fields: [
              'location',
              'latitude',
              'longitude',
              'revenue',
              'population',
            ],
          },
        ],
      },
    ];
  }, []);

  const myFunctions = useMemo(
    () => [
      createMapFunctionDefinition({
        getDataset: ({ datasetName }: GetDatasetForCreateMapFunctionArgs) => {
          // check if the dataset exists
          if (!SAMPLE_DATASETS[datasetName]) {
            throw new Error(`The dataset ${datasetName} does not exist.`);
          }
          return SAMPLE_DATASETS[datasetName];
        },
      }),
      queryDuckDBFunctionDefinition({
        getValues: (datasetName: string, variableName: string) => {
          try {
            const dataset = SAMPLE_DATASETS[datasetName];
            return dataset.map((row) => row[variableName]);
          } catch (error) {
            throw new Error(
              `Can not get the values of the variable ${variableName} from the dataset ${datasetName}.`
            );
          }
        },
      }),
    ],
    [SAMPLE_DATASETS]
  );

  const [aiConfig, setAiConfig] = useState<AiAssistantConfig>({
    isReady: false,
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_TOKEN || '',
    baseUrl: 'http://127.0.0.1:11434',
    temperature: 0.8,
    topP: 1.0,
  });

  const onAiConfigChange = (config: AiAssistantConfig) => {
    setAiConfig(config);
    initializeAssistant();
  };

  const assistantProps = useMemo(() => ({
    name: 'My AI Assistant',
    description: 'This is my AI assistant',
    version: '1.0.0',
    modelProvider: aiConfig.provider,
    model: aiConfig.model,
    apiKey: aiConfig.apiKey,
    welcomeMessage: 'Hi, I am your AI assistant',
    instructions: `You are a data analyst. You can help users to analyze data including creating charts, querying data, and creating maps. 

When responding to user queries:
1. Analyze if the task requires one or multiple function calls
2. For each required function:
   - Identify the appropriate function to call
   - Determine all required parameters
   - If parameters are missing, ask the user to provide them
   - Please ask the user to confirm the parameters
   - If the user doesn't agree, try to provide variable functions to the user
   - Execute functions in a sequential order
3. For SQL query, please help to generate select query clause using the content of the dataset:
   - please use double quotes for table name
   - please only use the columns that are in the dataset context
   - please try to use the aggregate functions if possible

${JSON.stringify(dataContext)}`,
      functions: myFunctions,
    }),
    [dataContext, myFunctions]
  );

  const { initializeAssistant, apiKeyStatus } = useAssistant(assistantProps);

  const historyMessages: MessageModel[] = [
    {
      message: 'Hello, how can I help you today?',
      direction: 'incoming',
      position: 'single',
    },
    {
      message: 'Can you check the relationship between revenue and population?',
      direction: 'outgoing',
      position: 'single',
    },
    {
      message: 'Yes, I can help you with that. Here is the scatterplot.',
      direction: 'incoming',
      position: 'single',
      payload: (
        <div className="mt-4 relative group">
          <ExpandableContainer defaultWidth={600} defaultHeight={800}>
            <ScatterplotComponent
              {...SCATTERPLOT_DATA}
              theme="light"
              regressionResults={regressionResults}
            />
          </ExpandableContainer>
        </div>
      ),
    },
    {
      message: 'Can you show me what data I can use in the chat?',
      direction: 'outgoing',
      position: 'single',
    },
    {
      message: `Here is the data you can use in the chat:

dataset: myVenues
column names:
- latitude (float)
- longtitude (float)
- revenue (float)
- population (int)

Please select your prefered LLM model and use your API key to start the chat.
      `,
      direction: 'incoming',
      position: 'single',
      payload: (
        <div className="mt-4">
          <ConfigPanel
            initialConfig={aiConfig}
            onConfigChange={onAiConfigChange}
          />
        </div>
      ),
    },
  ];

  return (
    <AiAssistant
      {...assistantProps}
      historyMessages={historyMessages}
      isMessageDraggable={true}
      enableVoice={true}
      enableScreenCapture={true}
      screenCapturedBase64={screenCaptured}
      onScreenshotClick={() => setStartScreenCapture(true)}
      onRemoveScreenshot={() => setScreenCaptured('')}
    />
  );
}
