import { openai } from '@ai-sdk/openai';
import { getDuckDBTool } from '@openassistant/duckdb';
import { getPlotsTool } from '@openassistant/plots';
import { createDataStreamResponse, streamText } from 'ai';

export async function POST(req: Request) {
  const systemPrompt = `You are a helpful assistant that can answer questions and help with tasks. 
You can use the following datasets:
- datasetName: natregimes
- variables: [HR60, PO60]
`;

  let toolAdditionalData: Record<string, unknown> = {};

  // create a tool for local query (runs in browser)
  const localQueryTool = getDuckDBTool('localQuery', {
    isExecutable: false,
  });

  // create a tool for histogram
  const histogramTool = getPlotsTool('histogram', {
    toolContext: {
      getValues: async (datasetName: string, variableName: string) => {
        console.log('getValues', datasetName, variableName);
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      },
    },
    onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
      console.log('onToolCompleted', toolCallId, additionalData);
      // save {toolCallId: additionalData} for rendering
      if (additionalData !== undefined) {
        toolAdditionalData[toolCallId] = additionalData;
      }
    },
    isExecutable: true,
  });

  const { messages } = await req.json();

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: openai('gpt-4o'),
        messages: messages,
        system: systemPrompt,
        tools: {
          localQuery: localQueryTool,
          histogram: histogramTool,
        },
        onFinish() {
          if (Object.keys(toolAdditionalData).length > 0) {
            // add additional data as message annotation:
            // @ts-expect-error - toolAdditionalData is a record of unknown values
            dataStream.writeMessageAnnotation(toolAdditionalData);
            // clean up toolAdditionalData
            toolAdditionalData = {};
          }
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (error) => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });
}
