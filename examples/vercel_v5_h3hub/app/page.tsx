// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

'use client';

import { useState, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { tool, Tool } from 'ai';
import { getUsCityGeojson } from '@openassistant/osm';
import {
  OpenAssistantTool,
  h3Cell,
  h3CellToChildren,
  h3CellsFromPolygon,
} from '@openassistant/h3hub';
import { polygonToCells } from 'h3-js';
import { createOpenAI } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  DefaultChatTransport,
  streamText,
  UIMessagePart,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';
import { MessageParts } from './components/parts';

const systemPrompt = `You are a helpful assistant that can answer questions and help with tasks.

Please try to use the tools to answer the question.
Please make a plan before you answer the question.
Please always make a summary of the plan in a markdown format.
`;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default function Home() {
  const [input, setInput] = useState('');

  const [toolAdditionalData, setToolAdditionalData] = useState<
    Record<string, unknown>
  >({});

  // Use ref for immediate access to tool data
  const toolDataRef = useRef<Record<string, unknown>>({});

  const onToolCompleted = (toolCallId: string, additionalData: unknown) => {
    console.log('onToolCompleted', toolCallId, additionalData);
    console.log('toolDataRef.current before update:', toolDataRef.current);
    // Update ref immediately for synchronous access
    toolDataRef.current = {
      ...toolDataRef.current,
      [toolCallId]: additionalData,
    };
    console.log('toolDataRef.current after update:', toolDataRef.current);
    // Also update state for UI updates
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

  const getGeometries = async (datasetName: string) => {
    console.log('getGeometries called with datasetName:', datasetName);
    console.log('toolDataRef.current:', toolDataRef.current);
    console.log(
      'Object.keys(toolDataRef.current):',
      Object.keys(toolDataRef.current)
    );

    // Search through all tool data to find the one with the matching datasetName
    for (const [toolCallId, toolData] of Object.entries(toolDataRef.current)) {
      console.log('Checking toolCallId:', toolCallId, 'toolData:', toolData);
      if (
        toolData &&
        typeof toolData === 'object' &&
        'datasetName' in toolData
      ) {
        const data = toolData as { datasetName: string; [key: string]: any };
        console.log(
          'Found data with datasetName:',
          data.datasetName,
          'looking for:',
          datasetName
        );
        if (data.datasetName === datasetName && datasetName in data) {
          const {type, content}= data[
            datasetName
          ] as { type: string; content: GeoJSON.FeatureCollection };
          console.log(
            'Found matching data, returning features:',
            content.features
          );
          return content.features;
        }
      }
    }
    console.log('No matching data found, returning null');
    return null;
  };

  function convertToVercelTool(
    oaTool: OpenAssistantTool,
    context: unknown,
    onToolCompleted: (toolCallId: string, additionalData: unknown) => void
  ): Tool {
    const myTool = {
      ...oaTool,
      context,
      onToolCompleted,
    };

    return tool({
      description: myTool.description,
      inputSchema: myTool.parameters,
      execute: async (args: Record<string, unknown>, options: any) => {
        const result = await myTool.execute(args as any, {
          ...options,
          context: myTool.context,
        });
        if (options.toolCallId && myTool.onToolCompleted) {
          myTool.onToolCompleted(options.toolCallId, result.additionalData);
        }
        return result.llmResult;
      },
    });
  }

  const h3CellTool = convertToVercelTool(h3Cell, {}, onToolCompleted);

  const h3CellToChildrenTool = convertToVercelTool(
    h3CellToChildren,
    {},
    onToolCompleted
  );

  const h3CellsFromPolygonTool = convertToVercelTool(
    h3CellsFromPolygon,
    { getGeometries },
    onToolCompleted
  );

  const myGetUsCityGeojson = {
    ...getUsCityGeojson,
    onToolCompleted: (toolCallId: string, additionalData: unknown) => {
      console.log('onToolCompleted', toolCallId, additionalData);
      // Update ref immediately so other tools in the same turn can read it
      toolDataRef.current = {
        ...toolDataRef.current,
        [toolCallId]: additionalData,
      };
      setToolAdditionalData((prev) => ({
        ...prev,
        [toolCallId]: additionalData,
      }));
    },
  };

  const getUsCityGeojsonTool = {
    description: myGetUsCityGeojson.description,
    inputSchema: myGetUsCityGeojson.parameters,
    execute: async (args: Record<string, unknown>, options: any) => {
      const result = await myGetUsCityGeojson.execute(args as any, {
        ...options,
        context: myGetUsCityGeojson.context,
      });
      if (options.toolCallId && myGetUsCityGeojson.onToolCompleted) {
        myGetUsCityGeojson.onToolCompleted(
          options.toolCallId,
          result.additionalData
        );
      }
      return result.llmResult;
    },
  };

  const tools = {
    h3Cell: h3CellTool,
    h3CellToChildren: h3CellToChildrenTool,
    h3CellsFromPolygon: h3CellsFromPolygonTool,
    getUsCityGeojson: getUsCityGeojsonTool,
  };

  // Custom fetch function that handles the AI processing locally
  const customFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
    const m = JSON.parse(init?.body as string);

    const result = streamText({
      model: openai('gpt-4.1'),
      messages: convertToModelMessages(m.messages),
      tools,
      system: systemPrompt,
      abortSignal: init?.signal as AbortSignal | undefined,
    });
    return result.toUIMessageStreamResponse();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // type MyUIMessage = UIMessage<unknown, unknown, typeof tools>;

  const { error, messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: customFetch,
    }),
    // local tools are handled by the client
    onToolCall: async ({ toolCall }) => {
      // In Vercel AI v5, the toolCall structure might have changed
      // We can check if it's the localQuery tool by checking the tool name or type
      void toolCall;
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Client-Only Chat Example</h1>
          <p className="text-gray-600">
            This example uses useChat with transport instead of API routes. Try
            asking `how many H3 cells are there in the city of San Francisco?`
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error.message}
            </div>
          )}
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
                parts={message.parts as Array<UIMessagePart<any, any>>}
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
