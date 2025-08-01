// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

'use client';

import { useChat } from '@ai-sdk/react';
import { useRef } from 'react';
import { SpatialGeometry } from '@geoda/core';
import {
  convertToVercelAiTool,
  getValuesFromGeoJSON,
} from '@openassistant/utils';

import { MessageParts } from './components/parts';
import { keplergl } from '@openassistant/map';

export default function Home() {
  // preserve the tool data between renders
  const toolAdditionalData = useRef<Record<string, unknown>>({});

  // context for local tools
  const getCachedData = async (
    datasetName: string
  ): Promise<unknown | null> => {
    // get cached data from other tools using datasetName as cacheId
    const toolData = Object.values(toolAdditionalData.current);
    for (const data of toolData) {
      if (data && typeof data === 'object' && datasetName in data) {
        const cache = (data as Record<string, unknown>)[datasetName];
        if (cache) {
          return cache;
        }
      }
    }
    return null;
  };

  // context for local tools
  const getValues = async (datasetName: string, variableName: string) => {
    // get cached data from e.g. downloadMapData tool
    const cachedData = await getCachedData(datasetName);
    if (cachedData) {
      return getValuesFromGeoJSON(
        cachedData as any,
        variableName
      );
    }
    throw new Error(
      `Can't get values for datasetName: ${datasetName} and variableName: ${variableName}`
    );
  };

  const getDataset = async (datasetName: string) => {
    // get cached data from e.g. downloadMapData tool
    const cachedData = await getCachedData(datasetName);
    if (cachedData) {
      return cachedData;
    }
    return null;
  };

  const getGeometries = async (
    datasetName: string
  ): Promise<SpatialGeometry | null> => {
    // get cached geometries from other tools using datasetName as cacheId
    const cachedData = await getCachedData(datasetName);
    if (cachedData) {
      return cachedData as SpatialGeometry;
    }
    return null;
  };

  const onToolCompleted = (toolCallId: string, additionalData: unknown) => {
    // save local tool outputs for tool rendering
    if (toolAdditionalData.current[toolCallId] === undefined) {
      toolAdditionalData.current[toolCallId] = additionalData;
    }
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 20,
    // local tools that are handled by the client
    onToolCall: async ({ toolCall }) => {
      const { toolName, args, toolCallId } = toolCall;
      if (toolName === 'keplergl') {
        const keplerglTool = convertToVercelAiTool({
          ...keplergl,
          context: { getDataset, getGeometries },
          onToolCompleted,
        });
        return keplerglTool.execute?.(args as Record<string, unknown>, {
          toolCallId,
        });
      }
    },
    onFinish: (message) => {
      // save the message.annotations from server-side tools for rendering tools
      message.annotations?.forEach((annotation) => {
        if (typeof annotation === 'object' && annotation !== null) {
          // annotation is a record of toolCallId and data from server-side tools
          // save the data for tool rendering
          if ('toolCallId' in annotation && 'data' in annotation) {
            const { toolCallId, data } = annotation as {
              toolCallId: string;
              data: unknown;
            };
            if (toolAdditionalData.current[toolCallId] === undefined) {
              toolAdditionalData.current[toolCallId] = data;
            }
          }
        }
      });
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Places Tool Example</h1>
          <p className="text-gray-600">
            Try asking for place searches, geocoding, routing, or spatial analysis!
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
                getValues={getValues}
              />
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask for place searches, directions, or spatial analysis..."
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