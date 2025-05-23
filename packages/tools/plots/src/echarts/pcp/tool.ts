import { z } from 'zod';
import { tool, generateId } from '@openassistant/utils';
import {
  ParallelCoordinateDataProps,
  processParallelCoordinateData,
} from './utils';
import { EChartsToolContext, isEChartsToolContext, OnSelected } from '../../types';

/**
 * The PCP tool is used to create a parallel coordinates plot.
 *
 * @example
 * ```typescript
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
 *   // render the PCP using <ParallelCoordinateComponentContainer props={additionalData} />
 * };
 *
 * const pcpTool = getVercelAiTool('pcp', toolContext, onToolCompleted);
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a PCP of the population and income?',
 *   tools: {pcp: pcpTool},
 * });
 * ```
 *
 * ### getValues()
 *
 * See {@link PCPFunctionContext} for detailed usage.
 *
 * User implements this function to get the values of the variable from dataset.
 *
 * For prompts like "_can you show a PCP of the revenue per capita for each location in dataset myVenues_", the tool will
 * call the `getValues()` function twice:
 * - get the values of **revenue** from dataset: getValues('myVenues', 'revenue')
 * - get the values of **population** from dataset: getValues('myVenues', 'population')
 */
export const pcp = tool<
  PCPFunctionArgs,
  PCPLlmResult,
  PCPAdditionalData,
  EChartsToolContext
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
});

export type PCPTool = typeof pcp;

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
