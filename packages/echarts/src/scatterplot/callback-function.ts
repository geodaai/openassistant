import {
  CallbackFunctionProps,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
} from '@openassistant/core';
import { ScatterplotFunctionContext } from './definition';
import {
  computeRegression,
  ComputeRegressionResult,
} from './utils/scatter-regression';

/**
 * The arguments of the scatterplot function.
 *
 * @param datasetName - The name of the dataset.
 * @param xVariableName - The name of the x variable.
 * @param yVariableName - The name of the y variable.
 * @param filteredIndex - The indices of the selected points.
 */
type ScatterplotFunctionArgs = {
  datasetName: string;
  xVariableName: string;
  yVariableName: string;
  filteredIndex?: number[];
};

/**
 * The result of the scatterplot function.
 *
 * @param success - Whether the function call is successful.
 * @param xVariableName - The name of the x variable.
 * @param yVariableName - The name of the y variable.
 * @param numberOfRows - The number of rows in the dataset.
 * @param details - The details of the function call.
 */
type ScatterplotOutputResult =
  | ErrorCallbackResult
  | {
      success: boolean;
      xVariableName: string;
      yVariableName: string;
      numberOfRows: number;
      details: string;
    };

/**
 * The data of the scatterplot function.
 *
 * @param datasetName - The name of the dataset.
 * @param xVariableName - The name of the x variable.
 * @param yVariableName - The name of the y variable.
 * @param xData - The x data.
 * @param yData - The y data.
 * @param regressionResults - The regression results.
 * @param filteredIndex - The indices of the selected points.
 * @param onSelected - The callback function can be used to sync the selections of the scatterplot with the original dataset.
 * @param theme - The theme of the scatterplot.
 * @param showLoess - Whether to show the loess regression.
 * @param showRegressionLine - Whether to show the regression line.
 */
export type ScatterplotOutputData = {
  datasetName: string;
  xVariableName: string;
  yVariableName: string;
  xData: number[];
  yData: number[];
  regressionResults: ComputeRegressionResult;
  filteredIndex?: number[];
  onSelected?: (datasetName: string, selectedIndices: number[]) => void;
  theme?: string;
  showLoess?: boolean;
  showRegressionLine?: boolean;
  isExpanded?: boolean;
  isDraggable?: boolean;
};

/**
 * Type guard of ScatterplotFunctionArgs
 */
function isScatterplotFunctionArgs(
  data: unknown
): data is ScatterplotFunctionArgs {
  return (
    typeof data === 'object' &&
    data !== null &&
    'datasetName' in data &&
    'xVariableName' in data &&
    'yVariableName' in data
  );
}

/**
 * Type guard of ScatterplotFunctionContext
 */
function isScatterplotFunctionContext(
  data: unknown
): data is ScatterplotFunctionContext {
  return typeof data === 'object' && data !== null && 'getValues' in data;
}

/**
 * The callback function for the scatterplot. When LLM calls the scatterplot function, it will be executed.
 * The result will be returned as a reponse of the function call to the LLM.
 *
 * @param functionName - The name of the function.
 * @param functionArgs - The arguments of the function.
 * @param functionContext - The context of the function.
 * @returns The result of the function.
 */
export async function ScatterplotCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<ScatterplotOutputResult, ScatterplotOutputData>
> {
  if (!isScatterplotFunctionArgs(functionArgs)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid scatterplot function arguments.',
      },
    };
  }

  const { datasetName, xVariableName, yVariableName } = functionArgs;

  if (!datasetName || !xVariableName || !yVariableName) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Dataset name and variable names are required.',
      },
    };
  }

  if (!isScatterplotFunctionContext(functionContext)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid scatterplot function context.',
      },
    };
  }

  const { getValues, filteredIndex, onSelected, theme, isDraggable } =
    functionContext;

  let values: { x: number[]; y: number[] };

  try {
    values = await getValues(datasetName, xVariableName, yVariableName);
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: `Failed to get values from dataset. ${error}`,
      },
    };
  }

  const xData = values.x;
  const yData = values.y;
  const numberOfRows = xData.length;

  try {
    const regressionResults = computeRegression({
      xData,
      yData,
      filteredIndex,
    });

    return {
      type: 'plot',
      name: functionName,
      result: {
        success: true,
        xVariableName,
        yVariableName,
        numberOfRows,
        details: `Scatter plot has been created and the regression statistics are ${JSON.stringify(regressionResults)}.`,
      },
      data: {
        datasetName,
        xVariableName,
        yVariableName,
        xData,
        yData,
        onSelected,
        filteredIndex,
        regressionResults,
        theme,
        showLoess: false,
        showRegressionLine: true,
        isDraggable,
      },
    };
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: `Failed to compute regression. ${error}`,
      },
    };
  }
}
