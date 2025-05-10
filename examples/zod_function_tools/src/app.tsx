import { tool } from '@openassistant/utils';
import { AiAssistant } from '@openassistant/ui';
import { z } from 'zod';

function WeatherStation({
  weather,
  station,
}: {
  weather: string;
  station: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border p-2 bg-gray-100">
      <div>{weather}</div>
      <div>{station}</div>
    </div>
  );
}

export function App() {
  const tools= {
    weather: tool({
      description: 'Get the weather in a city from a weather station',
      parameters: z
        .object({ cityName: z.string() })
        .describe('The city name to get the weather for'),
      execute: async ({ cityName }, options) => {
        if (!options || !options.context || !options.context['getStation']) {
          throw new Error('Context is required');
        }
        const getStation = options.context['getStation'];
        const station = getStation ? await getStation(cityName) : null;
        return {
          llmResult: {
            success: true,
            result: `The weather in ${cityName} is sunny from weather station ${station}.`,
          },
          additionalData: {
            weather: 'sunny',
            station,
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
