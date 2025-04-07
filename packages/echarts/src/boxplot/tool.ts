import { tool } from '@openassistant/core';
import { z } from 'zod';
import { isBoxplotFunctionContext } from './definition';
import { BoxplotDataProps, createBoxplot } from './component/utils';
import { generateId } from '@openassistant/common';
import { BoxplotComponent } from './component/box-plot-component';

async function executeBoxplot(
  { datasetName, variableNames, boundIQR = 1.5 },
  options
) {
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
        data: {
          id: boxplotId,
          boxplotData,
          boundIQR,
          datasetName,
        },
      },
      additionalData: {
        id: boxplotId,
        datasetName,
        variableNames,
        boxplotData,
        boundIQR,
        data,
        theme: config?.theme,
        isDraggable: config?.isDraggable,
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
 *
 */
export const boxplot = tool({
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
  component: BoxplotComponent,
});
