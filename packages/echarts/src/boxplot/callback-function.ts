import {
  CallbackFunctionProps,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
} from '@openassistant/core';
import { BoxplotDataProps, createBoxplot } from './component/utils';
import { BoxplotFunctionContext } from './tool';
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
      boxplotData: BoxplotDataProps;
    };

/**
 * Type guard for BoxplotFunctionArgs
 */
function isBoxplotFunctionArgs(data: unknown): data is BoxplotFunctionArgs {
  return (
    typeof data === 'object' &&
    data !== null &&
    'datasetName' in data &&
    'variableNames' in data &&
    'boundIQR' in data
  );
}

/**
 * @internal
 * @deprecated Use {@link boxplotCallbackFunction} instead
 */
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
  const { getValues, config } = functionContext as BoxplotFunctionContext;

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
    await Promise.all(
      variableNames.map(async (variable) => {
        const values = await getValues(datasetName, variable);
        data[variable] = values;
      })
    );

    // create boxplot data
    const boxplotData: BoxplotDataProps = createBoxplot({
      data,
      boundIQR: boundIQR || 1.5,
    });

    // create data for rendering the boxplot component
    const outputData: BoxplotOutputData = {
      id: generateId(),
      datasetName,
      variables: variableNames,
      boxplotData,
      data,
      boundIQR,
      theme: config?.theme,
      isDraggable: config?.isDraggable,
    };

    return {
      type: 'boxplot',
      name: functionName,
      result: {
        success: true,
        boundIQR,
        boxplotData,
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
