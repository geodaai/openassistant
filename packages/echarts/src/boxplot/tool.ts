import { tool } from '@openassistant/core';
import { z } from 'zod';
import { BoxplotFunctionContext, isBoxplotFunctionContext } from './definition';
import { BoxplotDataProps, createBoxplot } from './component/utils';
import { generateId } from '@openassistant/common';
import { BoxplotComponentContainer } from './component/box-plot-component';

/**
 * The boxplot tool is used to create a boxplot chart.
 *
 * @example
 * ```typescript
 * import { boxplot } from '@openassistant/echarts';
 *
 * const boxplotTool = {
 *   ...boxplot,
 *   context: {
 *     ...boxplot.context,
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
 * See {@link BoxplotFunctionContext} for detailed usage.
 *
 * User implements this function to get the values of the variable from dataset.
 *
 * For prompts like "_can you show a box plot of the revenue per capita for each location in dataset myVenues_", the tool will
 * call the `getValues()` function twice:
 * - get the values of **revenue** from dataset: getValues('myVenues', 'revenue')
 * - get the values of **population** from dataset: getValues('myVenues', 'population')
 *
 * A duckdb table will be created using the values returned from `getValues()`, and LLM will generate a sql query to query the table to answer the user's prompt.
 *

 */
export const boxplot = tool<
  // parameters of the tool
  z.ZodObject<{
    datasetName: z.ZodString;
    variableNames: z.ZodArray<z.ZodString>;
    boundIQR: z.ZodOptional<z.ZodNumber>;
  }>,
  // return type of the tool
  ExecuteBoxplotResult['llmResult'],
  // additional data of the tool
  ExecuteBoxplotResult['additionalData'],
  // type of the context
  BoxplotFunctionContext
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
    onSelected: () => {
      throw new Error('onSelected() of BoxplotTool is not implemented');
    },
    config: {
      isDraggable: false,
    },
  },
  component: BoxplotComponentContainer,
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

/**
 * The result of the boxplot tool.
 */
export type ExecuteBoxplotResult = {
  llmResult: {
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
  additionalData?: {
    id: string;
    datasetName: string;
    variables: string[];
    boxplotData: BoxplotDataProps;
    boundIQR: number;
    data?: Record<string, number[]>;
    theme?: string;
    isDraggable?: boolean;
    isExpanded?: boolean;
  };
};

async function executeBoxplot(
  { datasetName, variableNames, boundIQR = 1.5 },
  options
): Promise<ExecuteBoxplotResult> {
  try {
    if (!isBoxplotFunctionContext(options.context)) {
      throw new Error('Invalid context');
    }
    const { getValues, config } = options.context;

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
