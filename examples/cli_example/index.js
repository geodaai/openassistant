import { createAssistant } from '@openassistant/core';
import readlineSync from 'readline-sync';
import dotenv from 'dotenv';
import { extendedTool } from '@openassistant/utils';
import { z } from 'zod';

// Load environment variables
dotenv.config();

async function main() {
  console.log('Initializing OpenAssistant CLI...');

  const weather = extendedTool({
    description: 'Get the weather in a city from a weather station',
    parameters: z.object({ cityName: z.string(), reason: z.string() }),
    execute: async ({ cityName, reason }, options) => {
      const context = options?.context;

      const station = context?.getStation
        ? await context.getStation(cityName)
        : null;
      const temperature = context?.getTemperature
        ? await context.getTemperature(cityName)
        : null;
      return {
        llmResult: {
          success: true,
          message: `The temperature in ${cityName} is ${temperature} degrees from weather station ${station}.`,
        },
        additionalData: {
          cityName,
          temperature,
          station,
          reason,
        },
      };
    },
    context: {
      getStation: async (cityName) => {
        const stations = {
          'New York': '123',
          'Los Angeles': '456',
          Chicago: '789',
        };
        return stations[cityName];
      },
      getTemperature: async (cityName) => {
        const temperatures = {
          'New York': 70,
          'Los Angeles': 80,
          Chicago: 60,
        };
        return temperatures[cityName];
      },
    },
  });

  // Create the assistant instance
  const assistant = await createAssistant({
    name: 'cli-assistant',
    modelProvider: 'openai',
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY,
    version: '0.0.1',
    instructions:
      'You are a helpful CLI assistant that provides clear and concise responses.',
    tools: { weather },
  });

  console.log('OpenAssistant CLI is ready!');
  console.log('Type "exit" or "quit" to end the conversation.\n');

  while (true) {
    const userInput = readlineSync.question('You: ');

    if (
      userInput.toLowerCase() === 'exit' ||
      userInput.toLowerCase() === 'quit'
    ) {
      console.log('Goodbye!');
      break;
    }

    try {
      console.log('\nAssistant: ');
      await assistant.processTextMessage({
        textMessage: userInput,
        streamMessageCallback: ({ isCompleted, message }) => {
          if (isCompleted) {
            for (const part of message.parts) {
              if (part.type === 'text') {
                process.stdout.write(part.text);
              } else if (part.type === 'tool-invocation') {
                console.log(part);
              }
              process.stdout.write('\n\n');
            }
          }
        },
      });
    } catch (error) {
      console.error('\nError:', error.message);
    }
  }
}

main().catch(console.error);
