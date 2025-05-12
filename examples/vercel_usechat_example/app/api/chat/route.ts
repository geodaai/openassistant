import { openai } from '@ai-sdk/openai';
import { geocoding } from '@openassistant/osm';
import { getTool } from '@openassistant/utils';
import { dataClassify } from '@openassistant/geoda';

import { streamText } from 'ai';

// Create a context object for the tools
const context = {
  getValues: async (datasetName: string, variableName: string) => {
    console.log('getValues', datasetName, variableName);
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  },
};

const onToolCompleted = (toolCallId: string, additionalData: unknown) => {
  console.log('toolCallId', toolCallId);
  console.log('additionalData', additionalData);
};

console.log('geocoding', geocoding);
const geocodingTool = getTool(geocoding, context, onToolCompleted);
const dataClassifyTool = getTool(dataClassify, context, onToolCompleted);

console.log('geocodingTool', geocodingTool);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const model = openai('gpt-4o', {
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    const result = await streamText({
      model,
      messages: messages,
      tools: {
        geocodingTool,
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
