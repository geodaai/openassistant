import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { webSearch, getPlacesTool, PlacesToolNames } from '@openassistant/places';
import { convertToVercelAiTool } from '@openassistant/utils';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const webSearchTool = getPlacesTool(PlacesToolNames.webSearch, {
    toolContext: {
      getSearchAPIKey: () => process.env.SEARCH_API_KEY!,
    },
    onToolCompleted: (toolCallId, additionalData) => {
      console.log('WebSearch tool completed:', toolCallId, additionalData);
    },
  });

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages,
    tools: {
      webSearch: convertToVercelAiTool(webSearchTool),
    },
  });

  return result.toDataStreamResponse();
} 