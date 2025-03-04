import { MessageModel, tool } from '@openassistant/core';
import { AiAssistant } from '@openassistant/ui';
import { z } from 'zod';
import { SAVED_MESSAGES } from './messages';

function WeatherStation({
  temperature,
  station,
  cityName,
  reason,
}: {
  temperature: number;
  station: string;
  cityName: string;
  reason: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border p-2 bg-gray-100">
      <div>{reason}</div>
      <div className="flex flex-row gap-2">
        <div>{cityName}</div>
        <div>{temperature}°F</div>
        <div>Station: {station}</div>
      </div>
    </div>
  );
}

export function App() {
  const functions = {
    weather: tool({
      description: 'Get the weather in a city from a weather station',
      parameters: z
        .object({ cityName: z.string(), reason: z.string() }),
      execute: async ({ cityName, reason }, options) => {
        const getStation = options.context?.getStation;
        const station = getStation ? await getStation(cityName) : null;
        const getTemperature = options.context?.getTemperature;
        const temperature = getTemperature
          ? await getTemperature(cityName)
          : null;
        return {
          llmResult: `The temperature in ${cityName} is ${temperature} degrees from weather station ${station}.`,
          output: {
            cityName,
            temperature,
            station,
            reason,
          },
        };
      },
      context: {
        getStation: async (cityName: string) => {
          const stations = {
            'New York': '123',
            'Los Angeles': '456',
            Chicago: '789',
          };
          return stations[cityName];
        },
        getTemperature: async (cityName: string) => {
          const temperatures = {
            'New York': 70,
            'Los Angeles': 80,
            Chicago: 60,
          };
          return temperatures[cityName];
        },
      },
      component: WeatherStation,
    }),
  };

  const onMessagesUpdated = (messages: MessageModel[]) => {
    console.log(messages);
  };

  return (
    <div className="w-[400px] h-[800px] m-4">
      <AiAssistant
        name="My Assistant"
        apiKey={process.env.OPENAI_TOKEN || ''}
        version="v1"
        modelProvider="openai"
        model="gpt-4o"
        welcomeMessage="Hello, how can I help you today?"
        instructions="You are a helpful assistant."
        functions={functions}
        useMarkdown={true}
        onMessagesUpdated={onMessagesUpdated}
        initialMessages={SAVED_MESSAGES}
      />
    </div>
  );
}
