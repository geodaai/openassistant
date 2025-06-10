import { extendedTool } from '@openassistant/utils';
import { z } from 'zod';

import { EChartsToolContext } from '../types';

export type VegaLitePlotTool = typeof vegaLitePlot;

export type VegaLitePlotToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableNames: z.ZodArray<z.ZodString>;
  vegaLiteSpec: z.ZodString;
}>;

export type VegaLitePlotLlmResult = {
  success: boolean;
  vegaLiteSpec: string;
  plotType: string;
};

export type VegaLitePlotAdditionalData = {
  vegaLiteSpec: string;
  datasetName: string;
  variableNames: string[];
  plotType: string;
};

/**
 * Tool to create a Vega plot from a dataset and variables.
 *
 * There are many different plot types in Vega-Lite, you can find the full list of plot types [here](https://vega.github.io/vega-lite/docs/mark.html).
 *
 * **Example user prompts:**
 * - "Can you create a bar chart of the population for each location in dataset myVenues?"
 * - "Can you show a bar chart of the population for each location in dataset myVenues?"
 *
 * :::note
 * This tool is a browser-side tool.
 * :::
 *
 * @example
 * ```ts
 * import { vegaLitePlot, VegaLitePlotTool } from '@openassistant/plots';
 * // import { VegaPlotComponent } from '@openassistant/vegalite';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const vegaLitePlotTool: VegaLitePlotTool = {
 *   ...vegaLitePlot,
 *   context: {
 *     getValues: async (datasetName, variableName) => {
 *       // get the values of the variable from dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     console.log('Tool call completed:', toolCallId, additionalData);
 *     // render the Vega plot using <VegaPlotComponent props={additionalData} />
 *   },
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a bar chart of the population for each location in dataset myVenues?',
 *   tools: {
 *     vegaLitePlot: convertToVercelAiTool(vegaLitePlotTool),
 *   },
 * });
 * ```
 */
export const vegaLitePlot = extendedTool<
  VegaLitePlotToolArgs,
  VegaLitePlotLlmResult,
  VegaLitePlotAdditionalData,
  EChartsToolContext
>({
  description:
    'Create a plot using vega-lite. Please follow the vegaLite spec format.',
  parameters: z.object({
    datasetName: z.string(),
    variableNames: z.array(z.string()),
    vegaLiteSpec: z.string().describe(
      `The Vega-Lite spec to use to create the plot.
IMPORTANT: Use 'data-placeholder' as a placeholder to refer to the inline data.
Example format: {"data": data-placeholder, "mark": "bar", "encoding": {...}, "$schema"}
Use the following settings to avoid unnecessary axis range expansion for both x and y axes:
- scale.zero: false on the axis avoids forcing the axis to start at zero.
`
    ),
  }),
  execute: async ({ datasetName, variableNames, vegaLiteSpec }, options) => {
    try {
      const { getValues } = options?.context as EChartsToolContext;

      const data = {};
      await Promise.all(
        variableNames.map(async (variable) => {
          const values = await getValues(datasetName, variable);
          data[variable] = values;
        })
      );

      // convert data e.g. {variable1: [1, 2, 3], variable2: [4, 5, 6]} to inline tabular data
      // e.g. [
      //   {variable1: 1, variable2: 4},
      //   {variable1: 2, variable2: 5},
      //   {variable1: 3, variable2: 6},
      // ]
      const dataReplacement = Array.from(
        { length: data[variableNames[0]].length },
        (_, i) => {
          const row: Record<string, unknown> = {};
          variableNames.forEach((variable) => {
            row[variable] = data[variable][i];
          });
          return row;
        }
      );

      const vegaLiteSpecWithData = vegaLiteSpec
        .replace(
          '"data-placeholder"',
          JSON.stringify({ values: dataReplacement })
        )
        .replace(
          'data-placeholder',
          JSON.stringify({ values: dataReplacement })
        );

      return {
        llmResult: {
          success: true,
          vegaLiteSpec,
          result: 'Successfully created Vega-Lite plot',
        },
        additionalData: {
          vegaLiteSpec: vegaLiteSpecWithData,
          datasetName,
          variableNames,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          result: `Failed to create Vega-Lite plot: ${error}`,
        },
      };
    }
  },
  context: {
    getValues: async () => {
      throw new Error(
        'context getValues() not implemented for vegaLitePlot tool'
      );
    },
  },
});
