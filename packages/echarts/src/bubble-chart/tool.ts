import { z } from 'zod';
import { tool } from '@openassistant/core';
import {
  isBubbleChartFunctionArgs,
  isBubbleChartFunctionContext,
} from './callback-function';
import { generateId } from '@openassistant/common';

export const bubbleChart = tool({
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
    },
  },
  component: BubbleChartComponentContainer,
});

async function executeBubbleChart(args, options) {
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
        variableX: { name: variableX, values: xData },
        variableY: { name: variableY, values: yData },
        variableSize: { name: variableSize, values: sizeData },
        ...(variableColor && colorData
          ? { variableColor: { name: variableColor, values: colorData } }
          : {}),
        config,
      },
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        data: {
          details: `Failed to create bubble chart. ${error}`,
          instructions:
            'Pause the execution and ask the user to try with different prompt and context.',
        },
      },
    };
  }
}
