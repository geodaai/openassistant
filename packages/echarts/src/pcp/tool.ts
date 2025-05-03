import { z } from 'zod';
import { tool } from '@openassistant/utils';
import { generateId } from '@openassistant/common';
import { ParallelCoordinateComponentContainer } from './component/pcp-component';
import {
  ParallelCoordinateDataProps,
  processParallelCoordinateData,
} from './component/utils';
import { GetValues, OnSelected } from '../types';

/**
 * The PCP tool is used to create a parallel coordinates plot.
 *
 * @example
 * ```typescript
 * import { pcp } from '@openassistant/echarts';
 *
 * const pcpTool = {
 *   ...pcp,
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
 * See {@link PCPToolContext} for detailed usage.
 *
 */
export const pcp = tool<
  z.ZodObject<{
    datasetName: z.ZodString;
    variableNames: z.ZodArray<z.ZodString>;
  }>,
  ExecutePCPResult['llmResult'],
  ExecutePCPResult['additionalData'],
  PCPToolContext
>({
  description: 'create a parallel coordinates plot',
  parameters: z.object({
    datasetName: z.string().describe('The name of the dataset.'),
    variableNames: z
      .array(z.string())
      .describe(
        'Make sure the user provide at least two variables to create a PCP.'
      ),
  }),
  execute: executePCP,
  context: {
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
  component: ParallelCoordinateComponentContainer,
});

export type PCPTool = typeof pcp;

export type ExecutePCPResult = {
  llmResult: {
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
  additionalData?: {
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
};

export type PCPToolContext = {
  getValues: GetValues;
  onSelected?: OnSelected;
  config?: {
    isDraggable?: boolean;
    isExpanded?: boolean;
    theme?: string;
  };
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
