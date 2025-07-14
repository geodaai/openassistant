// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { extendedTool } from '@openassistant/utils';
import { AiAssistant } from '@openassistant/ui';
import { z } from 'zod';

function WeatherStation({
  station,
}: {
  station: {
    stationId: string;
    weather: string;
    timestamp: string;
  };
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border p-2 bg-gray-100">
      <div>Weather: {station.weather}</div>
      <div>Station ID: {station.stationId}</div>
      <div>Timestamp: {station.timestamp}</div>
    </div>
  );
}

export function App() {
  const tools = {
    weather: extendedTool({
      description: 'Get the weather in a city from a weather station',
      parameters: z
        .object({ cityName: z.string() })
        .describe('The city name to get the weather for'),
      execute: async ({ cityName }, options) => {
        if (!options || !options.context || !options.context['getStation']) {
          throw new Error('Context is required');
        }
        const getStation = options.context['getStation'];
        const station = await getStation(cityName);
        return {
          llmResult: {
            success: true,
            result: `The weather in ${cityName} is ${station.weather} from weather station ${station.stationId}.`,
          },
          additionalData: {
            station,
          },
        };
      },
      context: {
        getStation: async (cityName: string) => {
          const stations = {
            'New York': {
              stationId: '123',
              weather: 'sunny',
              timestamp: '2025-06-20 10:00:00',
            },
            'Los Angeles': {
              stationId: '456',
              weather: 'cloudy',
              timestamp: '2025-06-20 10:00:00',
            },
            Chicago: {
              stationId: '789',
              weather: 'rainy',
              timestamp: '2025-06-20 10:00:00',
            },
          };
          return stations[cityName];
        },
      },
      component: WeatherStation,
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Zod Function Tools Example</h1>
      <div className="w-[800px] h-[800px] m-4 rounded-lg shadow-lg p-6">
        <AiAssistant
          name="My Assistant"
          apiKey={process.env.OPENAI_API_KEY || ''}
          version="v1"
          modelProvider="openai"
          model="gpt-4o"
          welcomeMessage="Hello, how can I help you today?"
          instructions="You are a helpful assistant. 
- IMPORTANT:
  - Always provide a text description to the user before calling a tool, explaining what you are going to do.
  - Always provide a text response to the user after calling a tool, summarizing the results or explaining the next steps."
          tools={tools}
          useMarkdown={true}
        />
      </div>
    </div>
  );
}
