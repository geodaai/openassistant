import {
  CallbackFunctionProps,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
} from '@openassistant/core';
import { BoxplotDataProps, createBoxplot } from './component/utils';
import { BoxplotFunctionContext } from './definition';
import { BoxplotOutputData } from './component/box-plot';
import { generateId } from '@openassistant/common';

type BoxplotFunctionArgs = {
  variableNames: string[];
  boundIQR: number;
  datasetName?: string;
};

type BoxplotOutputResult =
  | ErrorCallbackResult
  | {
      success: boolean;
      boundIQR: number;
      boxplot: BoxplotDataProps;
    };

/**
 * Type guard for BoxplotFunctionArgs
 */
function isBoxplotFunctionArgs(data: unknown): data is BoxplotFunctionArgs {
  return (
    typeof data === 'object' &&
    data !== null &&
    'variableName' in data &&
    'boundIQR' in data
  );
}

export async function boxplotCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<BoxplotOutputResult, BoxplotOutputData>
> {
  if (!isBoxplotFunctionArgs(functionArgs)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid boxplot function arguments.',
      },
    };
  }

  const { boundIQR: inputIQR, variableNames, datasetName } = functionArgs;
  const { getValues, config, onSelected } = functionContext as BoxplotFunctionContext;

  if (!variableNames || !datasetName) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Variable name is required.',
      },
    };
  }

  const boundIQR =
    typeof inputIQR === 'number' ? inputIQR : parseFloat(inputIQR);

  try {
    const data = {};
    variableNames.forEach(async (variable) => {
      const values = await getValues(datasetName, variable);
      data[variable] = values;
    });

    // create boxplot data
    const boxplot: BoxplotDataProps = createBoxplot({
      data,
      boundIQR: boundIQR || 1.5,
    });

    // create data for rendering the boxplot component
    const outputData: BoxplotOutputData = {
      id: generateId(),
      datasetName,
      variables: variableNames,
      boxplot,
      data,
      boundIQR,
      theme: config?.theme,
      isDraggable: config?.isDraggable,
      onSelected,
    };

    return {
      type: 'boxplot',
      name: functionName,
      result: {
        success: true,
        boundIQR,
        boxplot,
      },
      data: outputData,
    };
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: `Failed to create boxplot. ${error}`,
      },
    };
  }
}
