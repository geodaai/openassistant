import { extendedTool, generateId } from '@openassistant/utils';
import { z } from 'zod';

import { BoxplotDataProps, createBoxplot } from './utils';
import {
  EChartsToolContext,
  isEChartsToolContext,
  OnSelected,
} from '../../types';

/**
 * The boxplot tool is used to create a box plot for a given dataset and variable.
 *
 * **Example user prompts:**
 * - "Can you create a box plot of the revenue per capita for each location in dataset myVenues?"
 * - "Can you show a box plot of the revenue per capita for each location in dataset myVenues?"
 *
 * @example
 * ```typescript
 * import { boxplot, BoxplotTool } from '@openassistant/plots';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const toolContext = {
 *   getValues: async (datasetName: string, variableName: string) => {
 *     // get the values of the variable from dataset, e.g.
 *     return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *   },
 * };
 *
 * const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
 *   console.log('Tool call completed:', toolCallId, additionalData);
 *   // render the boxplot using <BoxplotComponentContainer props={additionalData} />
 * };
 *
 * const boxplotTool: BoxplotTool = {
 *   ...boxplot,
 *   context: toolContext,
 *   onToolCompleted,
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a box plot of the revenue per capita for each location in dataset myVenues?',
 *   tools: {
 *     boxplot: convertToVercelAiTool(boxplotTool),
 *   },
 * });
 * ```
 */
export const boxplot = extendedTool<
  // parameters of the tool
  BoxplotToolArgs,
  // return type of the tool
  BoxplotLlmResult,
  // additional data of the tool
  BoxplotAdditionalData,
  // type of the context
  EChartsToolContext
>({
  description: 'create a boxplot chart',
  parameters: z.object({
    datasetName: z.string().describe('The name of the dataset.'),
    variableNames: z
      .array(z.string())
      .describe('The names of the variables to use in the chart.'),
    boundIQR: z
      .number()
      .optional()
      .describe(
        'The bound of the Interquartile Range (IQR). The default value is 1.5'
      ),
  }),
  execute: executeBoxplot,
  context: {
    getValues: () => {
      throw new Error('getValues() of BoxplotTool is not implemented');
    },
    onSelected: () => {},
    config: {
      isDraggable: false,
    },
  },
});

/**
 * The type of the boxplot tool, which contains the following properties:
 *
 * - description: The description of the tool.
 * - parameters: The parameters of the tool.
 * - execute: The function that will be called when the tool is executed.
 * - context: The context of the tool.
 * - component: The component that will be used to render the tool.
 *
 * The implementation of the tool is defined in {@link boxplot}.
 */
export type BoxplotTool = typeof boxplot;

export type BoxplotToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableNames: z.ZodArray<z.ZodString>;
  boundIQR: z.ZodOptional<z.ZodNumber>;
}>;

export type BoxplotLlmResult = {
  success: boolean;
  result?: {
    id: string;
    boxplotData: BoxplotDataProps;
    boundIQR: number;
    datasetName: string;
  };
  error?: string;
  instruction?: string;
};

export type BoxplotAdditionalData = {
  id: string;
  datasetName: string;
  variables: string[];
  boxplotData: BoxplotDataProps;
  boundIQR: number;
  data?: Record<string, number[]>;
  theme?: string;
  isDraggable?: boolean;
  isExpanded?: boolean;
  onSelected?: OnSelected;
};

/**
 * The result of the boxplot tool.
 */
export type ExecuteBoxplotResult = {
  llmResult: BoxplotLlmResult;
  additionalData?: BoxplotAdditionalData;
};

async function executeBoxplot(
  { datasetName, variableNames, boundIQR = 1.5 },
  options
): Promise<ExecuteBoxplotResult> {
  try {
    if (!isEChartsToolContext(options.context)) {
      throw new Error('Invalid context');
    }
    const { getValues, onSelected, config } = options.context;

    const data = {};
    await Promise.all(
      variableNames.map(async (variable) => {
        const values = await getValues(datasetName, variable);
        data[variable] = values;
      })
    );

    // create boxplot data
    const boxplotData: BoxplotDataProps = createBoxplot({
      data,
      boundIQR,
    });

    const boxplotId = generateId();

    return {
      llmResult: {
        success: true,
        result: {
          id: boxplotId,
          boxplotData,
          boundIQR,
          datasetName,
        },
      },
      additionalData: {
        id: boxplotId,
        datasetName,
        variables: variableNames,
        boxplotData,
        boundIQR,
        data,
        theme: config?.theme || 'light',
        isDraggable: config?.isDraggable || false,
        isExpanded: config?.isExpanded || false,
        onSelected,
      },
    };
  } catch (error) {
    console.error('Error executing boxplot:', error);
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        instruction:
          'Try to fix the error and create a boxplot. If the error persists, pause the execution and ask the user to try with different prompt and context.',
      },
    };
  }
}
