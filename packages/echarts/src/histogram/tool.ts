import { z } from 'zod';
import { tool } from '@openassistant/core';
import { generateId } from '@openassistant/common';
import { HistogramComponentContainer } from './component/histogram-component';
import { createHistogramBins } from './component/utils';

/**
 * The histogram tool.
 */
export const histogram = tool<
  z.ZodObject<{
    datasetName: z.ZodString;
    variableName: z.ZodString;
    numberOfBins: z.ZodOptional<z.ZodNumber>;
  }>,
  ExecuteHistogramResult['llmResult'],
  ExecuteHistogramResult['additionalData'],
  HistogramToolContext
>({
  description: 'create a histogram',
  parameters: z.object({
    datasetName: z.string().describe('The name of the dataset.'),
    variableName: z
      .string()
      .describe('The name of the variable to create a histogram for.'),
    numberOfBins: z
      .number()
      .optional()
      .describe(
        'The number of bins to create in the histogram. Default value is 5.'
      ),
  }),
  execute: executeHistogram,
  context: {
    getValues: () => {
      throw new Error('getValues() of HistogramTool is not implemented');
    },
    onSelected: () => {
      throw new Error('onSelected() of HistogramTool is not implemented');
    },
    config: {
      isDraggable: false,
      isExpanded: false,
      theme: 'light',
    },
  },
  component: HistogramComponentContainer,
});

/**
 * The type of the histogram tool.
 */
export type HistogramTool = typeof histogram;

/**
 * The result of the histogram tool.
 */
export type ExecuteHistogramResult = {
  llmResult: {
    success: boolean;
    result?: {
      id: string;
      datasetName: string;
      variableName: string;
      details: string;
    };
    error?: string;
    instruction?: string;
  };
  additionalData?: {
    id: string;
    datasetName: string;
    variableName: string;
    histogramData: {
      bin: number;
      binStart: number;
      binEnd: number;
    }[];
    barDataIndexes: number[][];
    theme?: string;
    isDraggable?: boolean;
    isExpanded?: boolean;
  };
};

/**
 * The context for the histogram tool.
 */
export type HistogramToolContext = {
  getValues: (datasetName: string, variableName: string) => Promise<number[]>;
  onSelected?: (datasetName: string, selectedIndices: number[]) => void;
  config?: {
    isDraggable?: boolean;
    isExpanded?: boolean;
    theme?: string;
  };
};

async function executeHistogram(
  { datasetName, variableName, numberOfBins = 5 },
  options
): Promise<ExecuteHistogramResult> {
  try {
    const { getValues, config } = options.context;

    const values = await getValues(datasetName, variableName);

    // Create histogram bins
    const { histogramData, barDataIndexes } = createHistogramBins(
      values,
      numberOfBins
    );

    const id = generateId();

    return {
      llmResult: {
        success: true,
        result: {
          id,
          datasetName,
          variableName,
          details: `Histogram created successfully for variable ${variableName} with ${numberOfBins} bins. Histogram data: ${JSON.stringify(histogramData)}.`,
        },
      },
      additionalData: {
        id,
        datasetName,
        variableName,
        histogramData,
        barDataIndexes,
        theme: config?.theme || 'light',
        isDraggable: config?.isDraggable || false,
        isExpanded: config?.isExpanded || false,
      },
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error: `Failed to create histogram. ${error}`,
        instruction:
          'Try to fix the error and create a histogram. If the error persists, pause the execution and ask the user to try with different prompt and context.',
      },
    };
  }
}
