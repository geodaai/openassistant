// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import React from 'react';
import { AiAssistant } from '@openassistant/ui';
import { keplergl, KeplerglTool } from '@openassistant/map';
import { dataClassify, DataClassifyTool } from '@openassistant/geoda';
import { KeplerGlComponent } from '@openassistant/keplergl';

import '@openassistant/ui/dist/index.css';
import { SAMPLE_DATASETS } from './dataset';

const getValues = async (datasetName: string, variableName: string) => {
  return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
};

export function App() {
  const keplerglTool: KeplerglTool = {
    ...keplergl,
    context: {
      ...keplergl.context,
      getDataset: async (datasetName) => SAMPLE_DATASETS[datasetName],
    },
    component: KeplerGlComponent,
  };

  const dataClassifyTool: DataClassifyTool = {
    ...dataClassify,
    context: {
      ...dataClassify.context,
      getValues,
    },
  };

  const tools = {
    keplergl: keplerglTool,
    dataClassify: dataClassifyTool,
  };

  const instructions = `You are a helpful assistant. 
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
    - income`;

  const welcomeMessage = `
  Welcome to the Kepler.gl Tool Example! You can ask me to create a map from a dataset. Try to use the createMap tool to create the map. For example,

  1. create a map of the myVenues dataset
  2. create a map of the myVenues dataset with the revenue as the color
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
            tools={tools}
            useMarkdown={true}
          />
        </div>
      </div>
    </div>
  );
}
