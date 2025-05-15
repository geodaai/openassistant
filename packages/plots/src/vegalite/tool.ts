import { tool } from '@openassistant/utils';
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
 * :::note
 * This tool is a browser-side tool.
 * :::
 *
 */
export const vegaLitePlot = tool<
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
