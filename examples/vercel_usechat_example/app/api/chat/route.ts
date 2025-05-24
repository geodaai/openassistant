import { openai } from '@ai-sdk/openai';
import { localQuery } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistant/utils';
import { streamText } from 'ai';

// create a tool for local query (runs in browser)
const localQueryTool = convertToVercelAiTool(localQuery, {
  isExecutable: false,
});

const systemPrompt = `You are a helpful assistant that can answer questions and help with tasks. 
You can use the following datasets:
- datasetName: natregimes
- variables: [HR60, PO60]
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-4o'),
      messages: messages,
      system: systemPrompt,
      tools: {
        localQuery: localQueryTool,
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
