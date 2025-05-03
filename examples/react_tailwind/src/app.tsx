import React, { useEffect } from 'react';
import { AiAssistant } from '@openassistant/ui';
import { getTool } from '@openassistant/echarts';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export function App() {
  useEffect(() => {
    async function main() {
      // Register a simple calculator tool
      const context = {
        getValues: (datasetName, variableName) => {
          console.log('getValues', datasetName, variableName);
          return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        },
      };
      const onToolCompleted = (toolCallId, result) => {
        console.log('toolCallId', toolCallId);
        console.log('result', result);
      };
      const histogram = getTool('histogram', context, onToolCompleted);

      // use tool in vercel ai
      const oai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        compatibility: 'strict'
      });
      const model = oai('gpt-4o');

      const result = await generateText({
        model,
        system:
          'You are a helpful assistant that can use tools to get information.',
        prompt: 'create a histogram of HR60 in dataset Natregimes',
        tools: {
          histogram,
        },
      });

      console.log(result);
    }
    main();
  }, []);

  return (
    <div className="w-[800px] h-[800px] m-4 rounded-lg shadow-lg p-6">
      <AiAssistant
        name="My Assistant"
        apiKey={process.env.OPENAI_API_KEY || ''}
        modelProvider="openai"
        model="gpt-4"
        welcomeMessage="Hello, how can I help you today?"
        instructions="You are a helpful assistant."
      />
    </div>
  );
}
