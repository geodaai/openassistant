// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { localQuery, LocalQueryTool } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistant/utils';
import { MessageParts } from './components/parts';

export default function Home() {
  const [toolAdditionalData, setToolAdditionalData] = useState<
    Record<string, unknown>
  >({});

  const onToolCompleted = (toolCallId: string, additionalData: unknown) => {
    console.log('onToolCompleted', toolCallId, additionalData);
    setToolAdditionalData((prev) => ({
      ...prev,
      [toolCallId]: additionalData,
    }));
  };

  const getValues = async (datasetName: string, variableName: string) => {
    console.log('getValues', datasetName, variableName);
    // simulate return values
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  };

  const myLocalQuery: LocalQueryTool = {
    ...localQuery,
    context: {
      ...localQuery.context,
      getValues,
    },
    onToolCompleted,
  };

  const localQueryTool = convertToVercelAiTool(myLocalQuery);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 20,
    // local tools are handled by the client
    onToolCall: async ({ toolCall }) => {
      const args = toolCall.args as Record<string, unknown>;
      if (toolCall.toolName === 'localQuery') {
        const result = await localQueryTool.execute?.(args, {
          toolCallId: toolCall.toolCallId,
        });
        console.log('result', result);
        return result;
      }
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Basic Chat Example</h1>
          <p className="text-gray-600">
            Try asking `what are the top 4 values of HR60?`
          </p>
        </div>

        <div className="border rounded-lg p-4 mb-4 h-[400px] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'
              }`}
            >
              <div className="font-semibold mb-1">
                {message.role === 'assistant' ? 'Assistant' : 'You'}:
              </div>
              <MessageParts
                parts={message.parts}
                toolAdditionalData={toolAdditionalData}
                getValues={getValues}
              />
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask for a chart visualization..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
