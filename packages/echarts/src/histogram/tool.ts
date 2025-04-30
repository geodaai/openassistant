import { z } from 'zod';
import { tool } from '@openassistant/core';
import { generateId } from '@openassistant/common';
import { HistogramComponentContainer } from './component/histogram-component';
import { createHistogramBins } from './component/utils';
import { GetValues, OnSelected } from '../types';

/**
 * The histogram tool is used to create a histogram chart.
 *
 * @example
 * ```typescript
 * import { histogram } from '@openassistant/echarts';
 *
 * const histogramTool = {
 *   ...histogram,
 *   context: {
 *     ...histogram.context,
 *     getValues: (datasetName: string, variableName: string) => {
 *       // get the values of the variable from your dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 * }
 * ```
 *
 * ### getValues()
 *
 * See {@link HistogramToolContext} for detailed usage.
 *
 * User implements this function to get the values of the variable from dataset.
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
    onSelected: () => {},
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
      binStart: number | string;
      binEnd: number | string;
    }[];
    barDataIndexes: number[][];
    theme?: string;
    isDraggable?: boolean;
    isExpanded?: boolean;
    onSelected?: OnSelected;
  };
};

/**
 * The context for the histogram tool.
 */
export type HistogramToolContext = {
  getValues: GetValues;
  onSelected?: OnSelected;
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
    const { getValues, onSelected, config } = options.context;

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
        onSelected,
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
