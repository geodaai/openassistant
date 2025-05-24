import { z } from 'zod';
import { extendedTool, generateId } from '@openassistant/utils';
import { EChartsToolContext, isEChartsToolContext, OnSelected } from '../../types';

/**
 * The bubble chart tool.
 *
 * To use it, you need to provide the implementation of the `getValues` function.
 *
 * @example
 * ```ts
 * import { getVercelAiTool } from '@openassistant/plots';
 * import { generateText } from 'ai';
 *
 * const toolContext = {
 *   getValues: async (datasetName, variableName) => {
 *     return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *   },
 * };
 *
 * const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
 *   console.log('Tool call completed:', toolCallId, additionalData);
 *   // render the bubble chart using <BubbleChartComponentContainer props={additionalData} />
 * };
 *
 * const bubbleChartTool = getVercelAiTool('bubbleChart', toolContext, onToolCompleted);
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a bubble chart of the population and income for each location in dataset myVenues, and use the size of the bubble to represent the revenue?',
 *   tools: {bubbleChart: bubbleChartTool},
 * });
 * ```
 *
 * ### getValues()
 *
 * See {@link BubbleChartFunctionContext} for detailed usage.
 *
 */
export const bubbleChart = extendedTool<
  BubbleChartToolArgs,
  BubbleChartLlmResult,
  BubbleChartAdditionalData,
  EChartsToolContext
>({
  description: 'create a bubble chart',
  parameters: z.object({
    datasetName: z.string(),
    variableX: z.string(),
    variableY: z.string(),
    variableSize: z
      .string()
      .describe('The name of the variable to use for bubble size.'),
    variableColor: z.string().optional(),
  }),
  execute: executeBubbleChart,
  context: {
    getValues: () => {
      throw new Error('getValues() of BubbleChartTool is not implemented');
    },
    onSelected: () => {},
    config: {
      isDraggable: false,
      theme: 'light',
    },
  },
});

export type BubbleChartTool = typeof bubbleChart;

export type BubbleChartToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableX: z.ZodString;
  variableY: z.ZodString;
  variableSize: z.ZodString;
  variableColor: z.ZodOptional<z.ZodString>;
}>;

export type BubbleChartLlmResult = {
  success: boolean;
  data?: {
    id: string;
    datasetName: string;
    details: string;
  };
  error?: string;
  instruction?: string;
};

export type BubbleChartAdditionalData = {
  id: string;
  datasetName: string;
  data: {
    variableX: { name: string; values: number[] };
    variableY: { name: string; values: number[] };
    variableSize: { name: string; values: number[] };
    variableColor?: { name: string; values: number[] };
  };
  isDraggable?: boolean;
  isExpanded?: boolean;
  theme?: string;
  onSelected?: OnSelected;
};

export type ExecuteBubbleChartResult = {
  llmResult: BubbleChartLlmResult;
  additionalData?: BubbleChartAdditionalData;
};

export type BubbleChartFunctionArgs = {
  datasetName: string;
  variableX: string;
  variableY: string;
  variableSize: string;
  variableColor?: string;
};

export function isBubbleChartFunctionArgs(
  data: unknown
): data is BubbleChartFunctionArgs {
  return (
    typeof data === 'object' &&
    data !== null &&
    'datasetName' in data &&
    'variableX' in data &&
    'variableY' in data &&
    'variableSize' in data
  );
}

async function executeBubbleChart(
  args,
  options
): Promise<ExecuteBubbleChartResult> {
  try {
    if (!isBubbleChartFunctionArgs(args)) {
      throw new Error(
        'Invalid arguments for bubbleChart tool. Please provide a valid arguments.'
      );
    }
    const { datasetName, variableX, variableY, variableSize, variableColor } =
      args;

    if (!isEChartsToolContext(options.context)) {
      throw new Error(
        'Invalid context for bubbleChart tool. Please provide a valid context.'
      );
    }
    const { getValues, config, onSelected } = options.context;

    const xData = await getValues(datasetName, variableX);
    const yData = await getValues(datasetName, variableY);
    const sizeData = await getValues(datasetName, variableSize);
    const colorData = variableColor
      ? await getValues(datasetName, variableColor)
      : null;

    const id = generateId();

    return {
      llmResult: {
        success: true,
        data: {
          id,
          datasetName,
          details:
            'Bubble chart created successfully using the provided variables.',
        },
      },
      additionalData: {
        id,
        datasetName,
        data: {
          variableX: { name: variableX, values: xData },
          variableY: { name: variableY, values: yData },
          variableSize: { name: variableSize, values: sizeData },
          ...(variableColor && colorData
            ? { variableColor: { name: variableColor, values: colorData } }
            : {}),
        },
        isDraggable: config?.isDraggable || false,
        isExpanded: config?.isExpanded || false,
        theme: config?.theme || 'light',
        onSelected,
      },
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error: `Failed to create bubble chart. ${error}`,
        instruction:
          'Try to fix the error and create a bubble chart. If the error persists, pause the execution and ask the user to try with different prompt and context.',
      },
    };
  }
}
