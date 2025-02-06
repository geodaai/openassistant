'use client';

import {
  createMapFunctionDefinition,
  GetDatasetForCreateMapFunctionArgs,
} from '@openassistant/keplergl';
import { useMemo, useState, useEffect } from 'react';
import { MessageModel, useAssistant } from '@openassistant/core';
import { AiAssistant, AiAssistantConfig, ConfigPanel } from '@openassistant/ui';
import { queryDuckDBFunctionDefinition } from '@openassistant/duckdb';
import {
  histogramFunctionDefinition,
  scatterplotFunctionDefinition,
} from '@openassistant/echarts';
import { SAMPLE_DATASETS } from './dataset';

function getValuesFromMyDatasets(datasetName: string, variableName: string) {
  try {
    const dataset = SAMPLE_DATASETS[datasetName];
    return dataset.map((item) => item[variableName]);
  } catch (error) {
    throw new Error(
      `Can not get the values of the variable ${variableName} from the dataset ${datasetName}.`
    );
  }
}

async function getScatterplotValuesFromDataset(
  datasetName: string,
  xVar: string,
  yVar: string
): Promise<{
  x: number[];
  y: number[];
}> {
  try {
    const dataset = SAMPLE_DATASETS[datasetName];
    return {
      x: dataset.map((item) => item[xVar]),
      y: dataset.map((item) => item[yVar]),
    };
  } catch (error) {
    throw new Error(
      `Can not get the values of the variables ${xVar} and ${yVar} from the dataset ${datasetName}.`
    );
  }
}

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

  const componentConfig = { isDraggable: true, theme: 'light' };

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
        config: componentConfig,
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
        config: componentConfig,
      }),
      histogramFunctionDefinition({
        getValues: getValuesFromMyDatasets,
        config: componentConfig,
      }),
      scatterplotFunctionDefinition({
        getValues: getScatterplotValuesFromDataset,
        config: componentConfig,
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

  const assistantProps = useMemo(
    () => ({
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
    [
      dataContext,
      myFunctions,
      aiConfig.provider,
      aiConfig.model,
      aiConfig.apiKey,
    ]
  );

  const { initializeAssistant, apiKeyStatus } = useAssistant(assistantProps);

  useEffect(() => {
    if (aiConfig.isReady && apiKeyStatus === 'success') {
      // initialize the assistant when the config is ready
      initializeAssistant();
    }
  }, [assistantProps, initializeAssistant, aiConfig, apiKeyStatus]);

  const onAiConfigChange = (config: AiAssistantConfig) => {
    setAiConfig(config);
  };

  const historyMessages: MessageModel[] = [
    {
      message: 'Hello, how can I help you today?',
      direction: 'incoming',
      position: 'single',
    },
    {
      message: `Here is the data you can use in the chat:

dataset: myVenues
column names:
- location (string)
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
      chatEndpoint='/api/chat'
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
