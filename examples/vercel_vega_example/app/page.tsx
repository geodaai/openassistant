// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

'use client';

import { useChat } from '@ai-sdk/react';
import { useRef } from 'react';
import { MessageParts } from './components/parts';

export default function Home() {
  // preserve the tool data between renders
  const toolAdditionalData = useRef<Record<string, unknown>>({});

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 20,
    onFinish: (message) => {
      // save the message.annotations from server-side tools for rendering tools
      message.annotations?.forEach((annotation) => {
        if (typeof annotation === 'object' && annotation !== null) {
          Object.entries(annotation).forEach(([key, value]) => {
            if (toolAdditionalData.current[key] === undefined) {
              toolAdditionalData.current[key] = value;
            }
          });
        }
      });
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Vega-Lite Tool Example</h1>
          <p className="text-gray-600">
            Try asking for creating a histogram or other chart visualization!
          </p>
        </div>

        <div className="border rounded-lg p-4 mb-4 h-[600px] overflow-y-auto">
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
                toolAdditionalData={toolAdditionalData.current}
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
