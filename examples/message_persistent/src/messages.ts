import { MessageModel } from "@openassistant/core";

export const SAVED_MESSAGES: MessageModel[] = [
  {
    message: 'Hello, how can I help you today?',
    sentTime: 'just now',
    sender: 'assistant',
    direction: 'incoming',
    position: 'first',
    messageContent: {
      reasoning: '',
      toolCallMessages: [],
      text: 'Hello, how can I help you today?',
    },
  },
  {
    message: 'which city is warmer: chicago or new york?',
    direction: 'outgoing',
    sender: 'user',
    position: 'normal',
    messageContent: {
      reasoning: '',
      toolCallMessages: [],
      text: 'which city is warmer: chicago or new york?',
    },
  },
  {
    message:
      'New York is currently warmer than Chicago. The temperature in New York is 70 degrees, while in Chicago it is 60 degrees.',
    direction: 'incoming',
    sender: 'assistant',
    position: 'normal',
    payload: null,
    messageContent: {
      reasoning: '',
      toolCallMessages: [
        {
          toolCallId: 'call_yi7lgm4vipDula2ROYV7sXMw',
          toolName: 'weather',
          args: {
            cityName: 'Chicago',
            reason: 'to compare its current temperature with New York',
          },
          text: '',
          llmResult: {
            success: true,
            llmResult:
              'The temperature in Chicago is 60 degrees from weather station 789.',
          },
          additionalData: {
            cityName: 'Chicago',
            temperature: 60,
            station: '789',
            reason: 'to compare its current temperature with New York',
          },
        },
        {
          toolCallId: 'call_WEv07ZJ03w5VFL1d9ODZVAE9',
          toolName: 'weather',
          args: {
            cityName: 'New York',
            reason: 'to compare its current temperature with Chicago',
          },
          text: '',
          llmResult: {
            success: true,
            llmResult:
              'The temperature in New York is 70 degrees from weather station 123.',
          },
          additionalData: {
            cityName: 'New York',
            temperature: 70,
            station: '123',
            reason: 'to compare its current temperature with Chicago',
          },
        },
      ],
      text: 'New York is currently warmer than Chicago. The temperature in New York is 70 degrees, while in Chicago it is 60 degrees.',
    },
  },
];