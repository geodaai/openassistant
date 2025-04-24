import {
  CallbackFunctionProps,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
} from '@openassistant/core';
import {
  computeRegression,
  ComputeRegressionResult,
} from './component/scatter-regression';
import { isScatterplotToolArgs, isScatterplotToolContext } from './tool';
import { OnSelected } from '../types';
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
 * @param id - The id of the scatterplot.
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
  id?: string;
  datasetName: string;
  xVariableName: string;
  yVariableName: string;
  xData: number[];
  yData: number[];
  regressionResults: ComputeRegressionResult;
  filteredIndex?: number[];
  onSelected?: OnSelected;
  theme?: string;
  showLoess?: boolean;
  showRegressionLine?: boolean;
  isExpanded?: boolean;
  setIsExpanded?: (isExpanded: boolean) => void;
  isDraggable?: boolean;
};

/**
 * @internal
 * @deprecated Use {@link scatterplot} tool instead.
 *
 * The callback function for the scatterplot. When LLM calls the scatterplot function, it will be executed.
 * The result will be returned as a reponse of the function call to the LLM.
 *
 * @param props - The callback function properties
 * @param props.functionName - The name of the function.
 * @param props.functionArgs - The arguments of the function.
 * @param props.functionContext - The context of the function.
 * @returns The result of the function.
 */
export async function ScatterplotCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<ScatterplotOutputResult, ScatterplotOutputData>
> {
  if (!isScatterplotToolArgs(functionArgs)) {
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

  if (!isScatterplotToolContext(functionContext)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid scatterplot function context.',
      },
    };
  }

  const { getValues, filteredIndex, onSelected, config } = functionContext;

  let values: { x: number[]; y: number[] };

  try {
    const xData = await getValues(datasetName, xVariableName);
    const yData = await getValues(datasetName, yVariableName);
    values = { x: xData, y: yData };
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
        theme: config?.theme || 'dark',
        showLoess: false,
        showRegressionLine: true,
        isDraggable: Boolean(config?.isDraggable),
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
