'use client';

import { useState } from 'react';
import { MessageModel } from '@openassistant/core';
import { AiAssistant, AiAssistantConfig, ConfigPanel } from '@openassistant/ui';
import { tools } from './tools';

export default function Assistant({
  screenCaptured,
  setScreenCaptured,
  setStartScreenCapture,
}: {
  screenCaptured: string;
  setScreenCaptured: (screenCaptured: string) => void;
  setStartScreenCapture: (startScreenCapture: boolean) => void;
}) {
  const [aiConfig, setAiConfig] = useState<AiAssistantConfig>({
    isReady: false,
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_TOKEN || '',
    temperature: 0.0,
    topP: 1.0,
  });

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

  const onAiConfigChange = (config: AiAssistantConfig) => {
    setAiConfig(config);
  };

  const initialMessages: MessageModel[] = [
    {
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
      messageContent: {
        text: `Here is the data you can use in the chat:

dataset: myVenues
column names:
- index (int)
- location (string)
- latitude (float)
- longitude (float)
- revenue (float)
- population (int)
- income (float)

Please select your prefered LLM model and use your API key to start the chat.
      `,
      },
    },
  ];

  return (
    <AiAssistant
      name="My AI Assistant"
      description="This is my AI assistant"
      version="1.0.0"
      modelProvider={aiConfig.provider}
      model={aiConfig.model}
      apiKey={aiConfig.apiKey}
      welcomeMessage="Hi, I am your AI assistant"
      instructions={instructions}
      tools={tools}
      initialMessages={initialMessages}
      isMessageDraggable={true}
      enableVoice={true}
      enableScreenCapture={true}
      screenCapturedBase64={screenCaptured}
      onScreenshotClick={() => setStartScreenCapture(true)}
      onRemoveScreenshot={() => setScreenCaptured('')}
      useMarkdown={true}
    />
  );
}
