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
  /**
   * The result object that will be returned to the LLM.
   */
  llmResult: {
    /**
     * Indicates whether the execution was successful.
     */
    success: boolean;
    /**
     * The result data if the execution was successful.
     */
    result?: {
      /**
       * The unique ID of the boxplot chart.
       */
      id: string;
      /**
       * The data required to render the boxplot.
       */
      boxplotData: BoxplotDataProps;
      /**
       * The bound IQR value used for the boxplot calculation.
       */
      boundIQR: number;
      /**
       * The name of the dataset used.
       */
      datasetName: string;
    };
    /**
     * The error message if the execution failed.
     */
    error?: string;
    /**
     * Instructions for the LLM in case of failure.
     */
    instruction?: string;
  };
  /**
   * Additional data associated with the boxplot result, primarily for rendering the component.
   */
  additionalData?: {
    /**
     * The unique ID of the boxplot chart, matching the one in `llmResult.result`.
     */
    id: string;
    /**
     * The name of the dataset used.
     */
    datasetName: string;
    /**
     * The names of the variables included in the boxplot.
     */
    variables: string[];
    /**
     * The data required to render the boxplot, matching the one in `llmResult.result`.
     */
    boxplotData: BoxplotDataProps;
    /**
     * The bound IQR value used for the boxplot calculation.
     */
    boundIQR: number;
    /**
     * The theme to be used for rendering the chart ('light' or 'dark').
     */
    theme: string;
    /**
     * Indicates whether the chart component is draggable.
     */
    isDraggable: boolean;
    /**
     * Indicates whether the chart component should be initially expanded.
     */
    isExpanded: boolean;
    /**
     * The raw data used to generate the boxplot. Keys are variable names, values are arrays of numbers.
     * This is populated by the `getValues` function.
     */
    // The raw data of the dataset, which is used to render the boxplot chart.
    data?: Record<string, number[]>;
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
          'Pause the execution and ask the user to try with different prompt and context.',
      },
    };
  }
}
