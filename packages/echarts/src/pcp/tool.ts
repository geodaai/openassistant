import { z } from 'zod';
import { tool } from '@openassistant/core';
import { generateId } from '@openassistant/common';
import { ParallelCoordinateComponentContainer } from './component/pcp-component';
import { isParallelCoordinateFunctionArgs } from './callback-function';
import {
  ParallelCoordinateDataProps,
  processParallelCoordinateData,
} from './component/utils';

/**
 * The PCP tool.
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
      .describe('The names of the variables to create a PCP for.'),
  }),
  execute: executePCP,
  context: {
    getValues: () => {
      throw new Error('getValues() of PCPTool is not implemented');
    },
    onSelected: () => {
      throw new Error('onSelected() of PCPTool is not implemented');
    },
    config: {
      isDraggable: false,
      isExpanded: false,
      theme: 'light',
    },
  },
  component: ParallelCoordinateComponentContainer,
});

/**
 * The type of the PCP tool.
 */
export type PCPTool = typeof pcp;

/**
 * The result of the PCP tool.
 */
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
  };
};

/**
 * The context for the PCP tool.
 */
export type PCPToolContext = {
  getValues: (datasetName: string, variableName: string) => Promise<number[]>;
  onSelected?: (datasetName: string, selectedIndices: number[]) => void;
  config?: {
    isDraggable?: boolean;
    isExpanded?: boolean;
    theme?: string;
  };
};

async function executePCP(args, options): Promise<ExecutePCPResult> {
  try {
    if (!isParallelCoordinateFunctionArgs(args)) {
      throw new Error('Invalid PCP function arguments.');
    }
    const { getValues, config } = options.context;
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
