import React from 'react';
import { AiAssistant } from '@openassistant/ui';
import { dataClassify, DataClassifyTool } from '@openassistant/geoda';
import { SAMPLE_DATASETS } from './dataset';
import { tool } from '@openassistant/core';
import { z } from 'zod';
export default function App() {
  const getValues = async (datasetName: string, variableName: string) => {
    return (SAMPLE_DATASETS[datasetName] as any[]).map(
      (item) => item[variableName]
    );
  };

  // Configure the dataClassify tool
  const classifyTool: DataClassifyTool = {
    ...dataClassify,
    context: {
      ...dataClassify.context,
      getValues,
    },
  };

  const thinkTool = tool({
    description:
      'Please ALWAYS use this tool to make a plan before calling any other tools to solve the problem.',
    parameters: z.object({
      question: z.string().describe('The question to think about'),
    }),
    execute: async ({ question }) => {
      return {
        llmResult: {
          success: true,
          result: {
            question,
            instruction: `
- Before executing the plan, please summarize the plan for using the tools.
- If the tools are missing parameters, please ask the user to provide the parameters.
- When executing the plan, please try to fix the error if there is any.
- After executing the plan, please summarize the result and provide the result in a markdown format.
`,
          },
        },
      };
    },
  });

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
            tools={{ dataClassify: classifyTool, think: thinkTool }}
            welcomeMessage={welcomeMessage}
            instructions={instructions}
          />
        </div>
      </div>
    </div>
  );
}
