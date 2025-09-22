// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions, generateId, z } from '@openassistant/utils';
import { computeRegression } from './utils';
import { isEChartsToolContext, OnSelected } from '../../types';

/**
 * The ScatterplotTool class creates scatter plots for given datasets and variables.
 * This tool extends OpenAssistantTool and provides a class-based approach for creating
 * interactive scatter plot visualizations using ECharts.
 *
 * **Example user prompts:**
 * - "Can you create a scatter plot of the population and income for each location in dataset myVenues?"
 * - "What is the relationship between population and income?"
 * - "Can you show a scatter plot of the population and income for each location in dataset myVenues?"
 *
 * @example
 * ```typescript
 * import { ScatterplotTool } from '@openassistant/plots';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const scatterplotTool = new ScatterplotTool();
 *
 * // Or with custom context and callbacks
 * const scatterplotTool = new ScatterplotTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // get the values of the variable from dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 *   ScatterplotComponent,
 *   (toolCallId, additionalData) => {
 *     console.log('Tool call completed:', toolCallId, additionalData);
 *     // render the scatterplot using <ScatterplotComponentContainer props={additionalData} />
 *   }
 * );
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'What is the relationship between population and income?',
 *   tools: {scatterplot: scatterplotTool.toVercelAiTool()},
 * });
 * ```
 *
 * ### getValues()
 *
 * See {@link ScatterplotToolContext} for detailed usage.
 *
 * User implements this function to get the values of the variables from dataset.
 *
 * For prompts like "_can you show a scatter plot of the population and income for each location in dataset myVenues_", the tool will
 * call the `getValues()` function twice:
 * - get the values of **population** from dataset: getValues('myVenues', 'population')
 * - get the values of **income** from dataset: getValues('myVenues', 'income')
 */
export class ScatterplotTool extends OpenAssistantTool<typeof ScatterplotArgs> {
  protected getDefaultDescription(): string {
    return 'Create scatter plots for data visualization using ECharts';
  }
  
  protected getDefaultParameters() {
    return ScatterplotArgs;
  }

  constructor(options: OpenAssistantToolOptions<typeof ScatterplotArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getValues: () => {
          throw new Error('getValues() of ScatterplotTool is not implemented');
        },
        onSelected: () => {},
        config: {
          isDraggable: false,
          isExpanded: false,
          theme: 'light',
          showLoess: false,
          showRegressionLine: true,
        },
      },
    });
  }

  async execute(
    params: z.infer<typeof ScatterplotArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<ExecuteScatterplotResult> {
    return executeScatterplot(params, options);
  }
}

export const ScatterplotArgs = z.object({
  datasetName: z.string().describe('The name of the dataset.'),
  xVariableName: z.string().describe('The name of the x-axis variable.'),
  yVariableName: z.string().describe('The name of the y-axis variable.'),
});

// For backward compatibility, create a default instance
export const scatterplot = new ScatterplotTool();

export type { ScatterplotTool };

export type ScatterplotFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  xVariableName: z.ZodString;
  yVariableName: z.ZodString;
}>;

export type ScatterplotLlmResult = {
  success: boolean;
  result?: {
    id: string;
    datasetName: string;
    xVariableName: string;
    yVariableName: string;
    details: string;
  };
  error?: string;
  instruction?: string;
};

export type ScatterplotAdditionalData = {
  id: string;
  datasetName: string;
  xVariableName: string;
  yVariableName: string;
  xData: number[];
  yData: number[];
  regressionResults?: {
    regression: {
      slope: {
        estimate: number;
        pValue: number;
        standardError: number;
        tStatistic: number;
      };
      intercept: {
        estimate: number;
        pValue: number;
        standardError: number;
        tStatistic: number;
      };
      rSquared: number;
    };
  };
  onSelected?: OnSelected;
  theme?: string;
  isDraggable?: boolean;
  isExpanded?: boolean;
  showLoess?: boolean;
  showRegressionLine?: boolean;
};

type ScatterplotToolArgs = {
  datasetName: string;
  xVariableName: string;
  yVariableName: string;
  filteredIndex?: number[];
};

export function isScatterplotToolArgs(
  data: unknown
): data is ScatterplotToolArgs {
  return (
    typeof data === 'object' &&
    data !== null &&
    'datasetName' in data &&
    'xVariableName' in data &&
    'yVariableName' in data
  );
}

export type ExecuteScatterplotResult = {
  llmResult: ScatterplotLlmResult;
  additionalData?: ScatterplotAdditionalData;
};

async function executeScatterplot(
  params: z.infer<typeof ScatterplotArgs>,
  options?: { context?: Record<string, unknown> }
): Promise<ExecuteScatterplotResult> {
  try {
    if (!isScatterplotToolArgs(params)) {
      throw new Error('Invalid scatterplot function arguments.');
    }
    if (!options?.context || !isEChartsToolContext(options.context)) {
      throw new Error('Invalid scatterplot function context.');
    }

    const { getValues, config, onSelected } = options.context;
    const { datasetName, xVariableName, yVariableName } = params;
    const xData = await getValues(datasetName, xVariableName);
    const yData = await getValues(datasetName, yVariableName);

    // Compute regression results
    const regressionResults = computeRegression({
      xData,
      yData,
      filteredIndex: [],
    });

    const id = generateId();

    return {
      llmResult: {
        success: true,
        result: {
          id,
          datasetName,
          xVariableName,
          yVariableName,
          details: `Scatterplot created successfully for variables ${xVariableName} and ${yVariableName}. The regression statistics are ${JSON.stringify(regressionResults)}.`,
        },
      },
      additionalData: {
        id,
        datasetName,
        xVariableName,
        yVariableName,
        xData,
        yData,
        regressionResults,
        onSelected,
        theme: config?.theme || 'light',
        isDraggable: config?.isDraggable || false,
        isExpanded: config?.isExpanded || false,
        showLoess: config?.showLoess || false,
        showRegressionLine: config?.showRegressionLine || true,
      },
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error: `Failed to create scatterplot. ${error}`,
        instruction:
          'Try to fix the error and create a scatterplot. If the error persists, pause the execution and ask the user to try with different prompt and context.',
      },
    };
  }
}
