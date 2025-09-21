// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions, generateId, z } from '@openassistant/utils';
import {
  ParallelCoordinateDataProps,
  processParallelCoordinateData,
} from './utils';
import {
  EChartsToolContext,
  isEChartsToolContext,
  OnSelected,
} from '../../types';

/**
 * The PCPTool class creates parallel coordinates plots for given datasets and variables.
 * This tool extends OpenAssistantTool and provides a class-based approach for creating
 * interactive parallel coordinate visualizations using ECharts.
 *
 * **Example user prompts:**
 * - "Can you create a PCP of the population and income for each location in dataset myVenues?"
 * - "What is the relationship between population and income?"
 * - "Can you show a PCP of the population and income for each location in dataset myVenues?"
 *
 * @example
 * ```typescript
 * import { PCPTool } from '@openassistant/plots';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const pcpTool = new PCPTool();
 *
 * // Or with custom context and callbacks
 * const pcpTool = new PCPTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getValues: async (datasetName, variableName) => {
 *       // get the values of the variable from dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 *   ParallelCoordinateComponent,
 *   (toolCallId, additionalData) => {
 *     console.log('Tool call completed:', toolCallId, additionalData);
 *     // render the PCP using <ParallelCoordinateComponentContainer props={additionalData} />
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a PCP of the population and income?',
 *   tools: {
 *     pcp: pcpTool.toVercelAiTool(),
 *   },
 * });
 * ```
 */
export class PCPTool extends OpenAssistantTool<typeof PCPArgs> {
  protected readonly defaultDescription = 'Create parallel coordinates plots for data visualization using ECharts';
  protected readonly defaultParameters = PCPArgs;

  constructor(options: OpenAssistantToolOptions<typeof PCPArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getValues: () => {
          throw new Error('getValues() of PCPTool is not implemented');
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
    params: z.infer<typeof PCPArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<ExecutePCPResult> {
    return executePCP(params, options);
  }
}

export const PCPArgs = z.object({
  datasetName: z.string().describe('The name of the dataset.'),
  variableNames: z
    .array(z.string())
    .describe(
      'Make sure the user provide at least two variables to create a PCP.'
    ),
});

// For backward compatibility, create a default instance
export const pcp = new PCPTool();

export type { PCPTool };

export type PCPFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableNames: z.ZodArray<z.ZodString>;
}>;

export type PCPLlmResult = {
  success: boolean;
  result?: {
    id: string;
    datasetName: string;
    variableNames: string[];
    details: string;
    image?: string;
  };
  error?: string;
  instruction?: string;
};

export type PCPAdditionalData = {
  id: string;
  datasetName: string;
  variables: string[];
  pcp: ParallelCoordinateDataProps;
  rawData: Record<string, number[]>;
  theme?: string;
  isDraggable?: boolean;
  isExpanded?: boolean;
  onSelected?: OnSelected;
};

export type ExecutePCPResult = {
  llmResult: PCPLlmResult;
  additionalData?: PCPAdditionalData;
};

type PCPToolArgs = {
  variableNames: string[];
  datasetName: string;
};

export function isPCPToolArgs(data: unknown): data is PCPToolArgs {
  return typeof data === 'object' && data !== null && 'variableNames' in data;
}

async function executePCP(args, options): Promise<ExecutePCPResult> {
  try {
    if (!isPCPToolArgs(args)) {
      throw new Error('Invalid PCP function arguments.');
    }
    if (!isEChartsToolContext(options.context)) {
      throw new Error(
        'Invalid context for PCP tool. Please provide a valid context.'
      );
    }
    const { getValues, onSelected, config } = options.context;
    const { datasetName, variableNames } = args;

    if (variableNames.length < 2) {
      throw new Error('Please provide at least two variables to create a PCP.');
    }

    const rawData = {};
    await Promise.all(
      variableNames.map(async (variable) => {
        const values = await getValues(datasetName, variable);
        rawData[variable] = values;
      })
    );

    const pcp = processParallelCoordinateData(rawData);

    const id = generateId();

    const additionalData = {
      id,
      datasetName,
      variables: variableNames,
      pcp,
      rawData,
      theme: config?.theme || 'light',
      isDraggable: config?.isDraggable || false,
      isExpanded: config?.isExpanded || false,
      onSelected,
    };

    return {
      llmResult: {
        success: true,
        result: {
          id,
          datasetName,
          variableNames,
          details: `Parallel Coordinates Plot created successfully for variables ${variableNames.join(', ')}. The PCP data is ${JSON.stringify(pcp)}.`,
        },
      },
      additionalData,
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error: `Failed to create PCP. ${error}`,
        instruction:
          'Try to fix the error and create a PCP. If the error persists, pause the execution and ask the user to try with different prompt and context.',
      },
    };
  }
}
