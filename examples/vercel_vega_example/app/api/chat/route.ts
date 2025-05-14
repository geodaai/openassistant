import { openai } from '@ai-sdk/openai';
import { getEChartsTool, EChartsToolNames } from '@openassistant/echarts';
import { createDataStreamResponse, streamText } from 'ai';

export async function POST(req: Request) {
  const systemPrompt = `You are a helpful assistant that can answer questions and help with tasks. 
You can use the following datasets:
- datasetName: natregimes
- variables: [HR60, PO60]
`;

  let toolAdditionalData: Record<string, unknown> = {};

  // create a tool for histogram
  const vegaLitePlotTool = getEChartsTool(EChartsToolNames.vegaLitePlot, {
    toolContext: {
      getValues: async (datasetName: string, variableName: string) => {
        // simulate values
        if (variableName === 'HR60') {
          return [65.2, 68.7, 72.1, 69.8, 71.3, 67.9, 70.5, 73.2, 66.8, 74.1];
        } else if (variableName === 'PO60') {
          return [42.3, 45.8, 39.7, 44.2, 41.5, 43.9, 40.1, 46.5, 38.9, 47.2];
        }
        throw new Error(`Variable ${variableName} not found in dataset ${datasetName}`);
      },
    },
    onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
      console.log('onToolCompleted', toolCallId, additionalData);
      // save {toolCallId: additionalData} for rendering in browser (if needed)
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
          vegaLitePlot: vegaLitePlotTool,
        },
        onFinish() {
          if (Object.keys(toolAdditionalData).length > 0) {
            // add additional data as message annotation:
            // @ts-expect-error - toolAdditionalData is a record of unknown values
            dataStream.writeMessageAnnotation(toolAdditionalData);
            // clean up toolAdditionalData for next call
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
