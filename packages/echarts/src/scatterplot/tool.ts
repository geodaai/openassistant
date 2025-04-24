import { z } from 'zod';
import { tool } from '@openassistant/core';
import { generateId } from '@openassistant/common';
import { ScatterplotComponentContainer } from './component/scatter-plot-component';
import { computeRegression } from './component/scatter-regression';
import { GetValues, OnSelected } from '../types';

/**
 * The scatterplot tool is used to create a scatterplot chart.
 *
 * @example
 * ```typescript
 * import { scatterplot } from '@openassistant/echarts';
 *
 * const scatterplotTool = {
 *   ...scatterplot,
 *   context: {
 *     ...scatterplot.context,
 *     getValues: (datasetName: string, variableName: string) => {
 *       // get the values of the variable from your dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 * }
 * ```
 *
 * :::tip
 * User: can you create a scatter plot using 'population' and 'income'?
 * :::
 *
 * ### getValues()
 *
 * See {@link ScatterplotToolContext} for detailed usage.
 *
 * User implements this function to get the values of the variables from dataset.
 */
export const scatterplot = tool<
  z.ZodObject<{
    datasetName: z.ZodString;
    xVariableName: z.ZodString;
    yVariableName: z.ZodString;
  }>,
  ExecuteScatterplotResult['llmResult'],
  ExecuteScatterplotResult['additionalData'],
  ScatterplotToolContext
>({
  description: 'create a scatterplot',
  parameters: z.object({
    datasetName: z.string().describe('The name of the dataset.'),
    xVariableName: z.string().describe('The name of the x-axis variable.'),
    yVariableName: z.string().describe('The name of the y-axis variable.'),
  }),
  execute: executeScatterplot,
  context: {
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
  component: ScatterplotComponentContainer,
});

export type ScatterplotTool = typeof scatterplot;

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

export type ScatterplotToolContext = {
  getValues: GetValues;
  onSelected?: OnSelected;
  filteredIndex?: number[];
  config?: {
    isDraggable?: boolean;
    theme?: string;
    isExpanded?: boolean;
    showLoess?: boolean;
    showRegressionLine?: boolean;
  };
};

export function isScatterplotToolContext(
  data: unknown
): data is ScatterplotToolContext {
  return typeof data === 'object' && data !== null && 'getValues' in data;
}

export type ExecuteScatterplotResult = {
  llmResult: {
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
  additionalData?: {
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
};

async function executeScatterplot(
  args,
  options
): Promise<ExecuteScatterplotResult> {
  try {
    if (!isScatterplotToolArgs(args)) {
      throw new Error('Invalid scatterplot function arguments.');
    }
    if (!isScatterplotToolContext(options.context)) {
      throw new Error('Invalid scatterplot function context.');
    }

    const { getValues, config, onSelected } = options.context;
    const { datasetName, xVariableName, yVariableName } = args;
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
