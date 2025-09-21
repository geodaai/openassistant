// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions, z } from '@openassistant/utils';

import { EChartsToolContext } from '../types';

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
 * VegaLitePlotTool Class
 * 
 * The VegaLitePlotTool class creates Vega-Lite plots from datasets and variables.
 * This tool extends OpenAssistantTool and provides a class-based approach for creating
 * interactive visualizations using the Vega-Lite specification language.
 *
 * There are many different plot types in Vega-Lite, you can find the full list of plot types [here](https://vega.github.io/vega-lite/examples/).
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
 * import { VegaLitePlotTool } from '@openassistant/plots';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const vegaLitePlotTool = new VegaLitePlotTool();
 *
 * // Or with custom context and callbacks
 * const vegaLitePlotTool = new VegaLitePlotTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getValues: async (datasetName, variableName) => {
 *       // get the values of the variable from dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 *   VegaPlotComponent,
 *   (toolCallId, additionalData) => {
 *     console.log('Tool call completed:', toolCallId, additionalData);
 *     // you can import { VegaPlotComponent } from '@openassistant/vegalite'; 
 *     // render the Vega plot using <VegaPlotComponent props={additionalData} />
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a bar chart of the population for each location in dataset myVenues?',
 *   tools: {
 *     vegaLitePlot: vegaLitePlotTool.toVercelAiTool(),
 *   },
 * });
 * ```
 */
export class VegaLitePlotTool extends OpenAssistantTool<typeof VegaLitePlotArgs> {
  protected readonly defaultDescription = 'Create Vega-Lite plots from datasets and variables using Vega-Lite specification';
  protected readonly defaultParameters = VegaLitePlotArgs;

  constructor(options: OpenAssistantToolOptions<typeof VegaLitePlotArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getValues: async () => {
          throw new Error(
            'context getValues() not implemented for vegaLitePlot tool'
          );
        },
      },
    });
  }

  async execute(
    params: z.infer<typeof VegaLitePlotArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<{
    llmResult: VegaLitePlotLlmResult;
    additionalData?: VegaLitePlotAdditionalData;
  }> {
    try {
      const { getValues } = options?.context as EChartsToolContext;
      const { datasetName, variableNames, vegaLiteSpec } = params;

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
          plotType: 'vega-lite',
        },
        additionalData: {
          vegaLiteSpec: vegaLiteSpecWithData,
          datasetName,
          variableNames,
          plotType: 'vega-lite',
        },
      };
    } catch {
      return {
        llmResult: {
          success: false,
          vegaLiteSpec: '',
          plotType: 'vega-lite',
        },
      };
    }
  }
}

export const VegaLitePlotArgs = z.object({
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
});

// For backward compatibility, create a default instance
export const vegaLitePlot = new VegaLitePlotTool();

export type { VegaLitePlotTool };
