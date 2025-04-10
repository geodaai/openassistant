import { z } from 'zod';
import { tool } from '@openassistant/core';
import { generateId } from '@openassistant/common';
import { ScatterplotComponentContainer } from './component/scatter-plot-component';
import { computeRegression } from './component/scatter-regression';
import {
  isScatterplotFunctionArgs,
  isScatterplotFunctionContext,
} from './callback-function';

/**
 * The scatterplot tool.
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
    onSelected: () => {
      throw new Error('onSelected() of ScatterplotTool is not implemented');
    },
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

/**
 * The type of the scatterplot tool.
 */
export type ScatterplotTool = typeof scatterplot;

/**
 * The result of the scatterplot tool.
 */
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
    onSelected?: (datasetName: string, selectedIndices: number[]) => void;
    theme?: string;
    isDraggable?: boolean;
    isExpanded?: boolean;
    showLoess?: boolean;
    showRegressionLine?: boolean;
  };
};

/**
 * The context for the scatterplot tool.
 */
export type ScatterplotToolContext = {
  getValues: (datasetName: string, variableName: string) => Promise<number[]>;
  onSelected?: (datasetName: string, selectedIndices: number[]) => void;
  config?: {
    isDraggable?: boolean;
    isExpanded?: boolean;
    theme?: string;
    showLoess?: boolean;
    showRegressionLine?: boolean;
  };
};

async function executeScatterplot(
  args,
  options
): Promise<ExecuteScatterplotResult> {
  try {
    if (!isScatterplotFunctionArgs(args)) {
      throw new Error('Invalid scatterplot function arguments.');
    }
    if (!isScatterplotFunctionContext(options.context)) {
      throw new Error('Invalid scatterplot function context.');
    }

    const { getValues, config } = options.context;
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
        onSelected: options.context.onSelected,
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
