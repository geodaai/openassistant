import { MessageModel } from '@openassistant/core';

export const SAVED_MESSAGES: MessageModel[] = [
  {
    sentTime: 'just now',
    sender: 'assistant',
    direction: 'incoming',
    position: 'first',
    messageContent: {
      parts: [
        {
          type: 'text',
          text: 'Hello, how can I help you today?',
        },
      ],
    },
  },
  {
    direction: 'outgoing',
    sender: 'user',
    position: 'normal',
    messageContent: {
      parts: [
        {
          type: 'text',
          text: 'which city is warmer: chicago or new york?',
        },
      ],
    },
  },
  {
    direction: 'incoming',
    sender: 'assistant',
    position: 'normal',
    payload: null,
    messageContent: {
      parts: [
        {
          type: 'tool-invocation',
          toolInvocation: {
            toolCallId: 'call_yi7lgm4vipDula2ROYV7sXMw',
            toolName: 'weather',
            state: 'result',
            args: {
              cityName: 'Chicago',
              reason: 'to compare its current temperature with New York',
            },
            result: {
              success: true,
              result:
                'The temperature in Chicago is 60 degrees from weather station 789.',
            },
          },
          additionalData: {
            cityName: 'Chicago',
            temperature: 60,
            station: '789',
            reason: 'to compare its current temperature with New York',
          },
          isCompleted: true,
        },
        {
          type: 'tool-invocation',
          toolInvocation: {
            toolCallId: 'call_WEv07ZJ03w5VFL1d9ODZVAE9',
            toolName: 'weather',
            state: 'result',
            args: {
              cityName: 'New York',
              reason: 'to compare its current temperature with Chicago',
            },
            result: {
              success: true,
              llmResult:
                'The temperature in New York is 70 degrees from weather station 123.',
            },
          },
          isCompleted: true,
          additionalData: {
            cityName: 'New York',
            temperature: 70,
            station: '123',
            reason: 'to compare its current temperature with Chicago',
          },
        },
        {
          type: 'text',
          text: 'New York is currently warmer than Chicago. The temperature in New York is 70 degrees, while in Chicago it is 60 degrees.',
        },
      ],
    },
  },
];
