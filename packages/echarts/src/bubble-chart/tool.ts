import { z } from 'zod';
import { tool } from '@openassistant/core';
import {
  isBubbleChartFunctionArgs,
  isBubbleChartFunctionContext,
} from './callback-function';
import { generateId } from '@openassistant/common';
import { BubbleChartComponentContainer } from './component/bubble-chart-component';

/**
 * The bubble chart tool.
 */
export const bubbleChart = tool<
  z.ZodObject<{
    datasetName: z.ZodString;
    variableX: z.ZodString;
    variableY: z.ZodString;
    variableSize: z.ZodString;
    variableColor: z.ZodOptional<z.ZodString>;
  }>,
  ExecuteBubbleChartResult['llmResult'],
  ExecuteBubbleChartResult['additionalData'],
  BubbleChartToolContext
>({
  description: 'create a bubble chart',
  parameters: z.object({
    datasetName: z.string().describe('The name of the dataset.'),
    variableX: z
      .string()
      .describe('The name of the variable to use on the X-axis.'),
    variableY: z
      .string()
      .describe('The name of the variable to use on the Y-axis.'),
    variableSize: z
      .string()
      .describe('The name of the variable to use for bubble size.'),
    variableColor: z
      .string()
      .optional()
      .describe('The name of the variable to use for bubble color.'),
  }),
  execute: executeBubbleChart,
  context: {
    getValues: () => {
      throw new Error('getValues() of BubbleChartTool is not implemented');
    },
    config: {
      isDraggable: false,
      theme: 'light',
    },
  },
  component: BubbleChartComponentContainer,
});

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

    if (!isBubbleChartFunctionContext(options.context)) {
      throw new Error(
        'Invalid context for bubbleChart tool. Please provide a valid context.'
      );
    }
    const { getValues, config } = options.context;

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

/**
 * The bubble chart tool.
 *
 * To use it, you need to provide the implementation of the `getValues` function.
 *
 * @example
 * ```ts
 * import { bubbleChart } from '@openassistant/echarts';
 *
 * const bubbleChartTool = {
 *   ...bubbleChart,
 *   context: {
 *     getValues: async (datasetName, variableName) => {
 *       // return the values of the variable from the dataset
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 * };
 * ```
 *
 * ### getValues()
 *
 * See {@link BubbleChartFunctionContext} for detailed usage.
 *
 */
export type BubbleChartTool = typeof bubbleChart;

export type ExecuteBubbleChartResult = {
  llmResult: {
    success: boolean;
    data?: {
      id: string;
      datasetName: string;
      details: string;
    };
    error?: string;
    instruction?: string;
  };
  additionalData?: {
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
  };
};

/**
 * The context for the bubble chart tool.
 *
 * @param getValues - The function to get the values of the variable from the dataset.
 * @param onSelected - The function to handle the selected indices of the bubble chart.
 * @param config - The configuration for the bubble chart.
 */
export type BubbleChartToolContext = {
  getValues: (datasetName: string, variableName: string) => Promise<number[]>;
  onSelected?: (datasetName: string, selectedIndices: number[]) => void;
  config?: {
    isDraggable?: boolean;
    isExpanded?: boolean;
    theme?: string;
  };
};
