'use client';

import { useChat } from '@ai-sdk/react';
import { getDuckDBTool, DuckDBToolNames } from '@openassistant/duckdb';
import { getMapTool, MapToolNames } from '@openassistant/map';
import { useRef } from 'react';
import { MessageParts } from './components/parts';
import { SpatialGeometry } from '@geoda/core';

export default function Home() {
  // preserve the tool data between renders
  const toolAdditionalData = useRef<Record<string, unknown>>({});

  // context for local tools
  const getValues = async (datasetName: string, variableName: string) => {
    // simulate a local tool that returns a list of values
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  };

  const getDataset = async (datasetName: string) => {
    // simulate a local tool that returns a list of geometries
    if (datasetName === 'natregimes') {
      const points = [
        [111.96625, 33.30202],
        [111.97234, 33.29876],
        [111.96018, 33.30543],
      ];
      return points.map((point, index) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: point,
        },
        properties: { id: index + 1 },
      }));
    } else if (datasetName === 'world_countries') {
      const points = [
        [101.96625, 33.30202],
        [101.97234, 33.29876],
        [101.96018, 33.30543],
      ];
      return points.map((point, index) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: point,
        },
        properties: { id: index + 1 },
      }));
    }
    return null;
  };

  const getGeometries = async (datasetName: string): Promise<SpatialGeometry | null> => {
    // get cached geometries from other tools
    const toolData = Object.values(toolAdditionalData.current);

    for (const data of toolData) {
      if (data && typeof data === 'object' && datasetName in data) {
        const cache = (data as Record<string, unknown>)[datasetName];
        if (cache) {
          return cache as SpatialGeometry;
        }
      }
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
      if (toolName === 'localQuery') {
        const localQueryTool = getDuckDBTool(DuckDBToolNames.localQuery, {
          toolContext: { getValues },
          onToolCompleted,
        });
        const result = await localQueryTool.execute?.(
          args as Record<string, unknown>,
          { toolCallId }
        );
        return result;
      } else if (toolName === MapToolNames.keplergl) {
        const keplerglTool = getMapTool(MapToolNames.keplergl, {
          toolContext: { getDataset, getGeometries },
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
          <h1 className="text-4xl font-bold mb-4">ECharts Chat Example</h1>
          <p className="text-gray-600">
            Try asking for geocoding, routing, or isochrone!
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
