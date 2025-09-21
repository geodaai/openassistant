// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import { OpenAssistantTool, OpenAssistantToolOptions, generateId } from '@openassistant/utils';
import { createHistogramBins } from './utils';
import {
  EChartsToolContext,
  isEChartsToolContext,
  OnSelected,
} from '../../types';

/**
 * The HistogramTool class creates histogram charts for given datasets and variables.
 * This tool extends OpenAssistantTool and provides a class-based approach for creating
 * interactive histogram visualizations using ECharts.
 *
 * @example
 * ```typescript
 * import { HistogramTool } from '@openassistant/plots';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const histogramTool = new HistogramTool();
 *
 * // Or with custom context and callbacks
 * const histogramTool = new HistogramTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // get the values of the variable from dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 *   HistogramComponent,
 *   (toolCallId, additionalData) => {
 *     console.log('Tool call completed:', toolCallId, additionalData);
 *     // render the histogram using <HistogramComponentContainer props={additionalData} />
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a histogram of the revenue per capita for each location in dataset myVenues?',
 *   tools: {
 *     histogram: histogramTool.toVercelAiTool(),
 *   },
 * });
 * ```
 */
export class HistogramTool extends OpenAssistantTool<typeof HistogramArgs> {
  protected readonly defaultDescription = 'Create histogram charts for data visualization';
  protected readonly defaultParameters = HistogramArgs;

  constructor(options: OpenAssistantToolOptions<typeof HistogramArgs> = {}) {
    super({
      ...options,
      context: options.context || {
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
    });
  }

  async execute(
    params: z.infer<typeof HistogramArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<ExecuteHistogramResult> {
    return executeHistogram(params, options);
  }
}

export const HistogramArgs = z.object({
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
});

// For backward compatibility, create a default instance
export const histogram = new HistogramTool();

// Export the class as the main type
export type { HistogramTool };

// Legacy type for backward compatibility
export type HistogramToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableName: z.ZodString;
  numberOfBins: z.ZodOptional<z.ZodNumber>;
}>;

export type HistogramLlmResult = {
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

export type HistogramAdditionalData = {
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

/**
 * The result of the histogram tool.
 */
export type ExecuteHistogramResult = {
  llmResult: HistogramLlmResult;
  additionalData?: HistogramAdditionalData;
};

async function executeHistogram(
  params: z.infer<typeof HistogramArgs>,
  options?: { context?: Record<string, unknown> }
): Promise<ExecuteHistogramResult> {
  const { datasetName, variableName, numberOfBins = 5 } = params;
  try {
    if (!isEChartsToolContext(options.context)) {
      throw new Error(
        'Invalid context for histogram tool. Please provide a valid context.'
      );
    }
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
