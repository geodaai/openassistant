import {
  CallbackFunctionProps,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
} from '@openassistant/core';
import { generateId } from '@openassistant/common';
import { ParallelCoordinateOutputData } from './component/pcp';
import { ParallelCoordinateDataProps } from './component/utils';
import { ParallelCoordinateFunctionContext } from './definition';

type ParallelCoordinateFunctionArgs = {
  variableNames: string[];
  datasetName: string;
};

type ParallelCoordinateOutputResult =
  | ErrorCallbackResult
  | {
      success: boolean;
      pcp: ParallelCoordinateDataProps;
    };

/**
 * Type guard for PcpFunctionArgs
 */
function isParallelCoordinateFunctionArgs(
  data: unknown
): data is ParallelCoordinateFunctionArgs {
  return typeof data === 'object' && data !== null && 'variableNames' in data;
}

export async function parallelCoordinateCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<
    ParallelCoordinateOutputResult,
    ParallelCoordinateOutputData
  >
> {
  if (!isParallelCoordinateFunctionArgs(functionArgs)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid PCP function arguments.',
      },
    };
  }

  const { variableNames, datasetName } = functionArgs;
  const { getValues, config } =
    functionContext as ParallelCoordinateFunctionContext;

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

  try {
    const rawData = {};
    const pcp: ParallelCoordinateDataProps = [];
    variableNames.forEach(async (variable) => {
      const values = await getValues(datasetName, variable);
      // get min, max, mean and std of the values
      const min = Math.min(...values);
      const max = Math.max(...values);
      const mean =
        values.reduce((sum, value) => sum + value, 0) / values.length;
      const std = Math.sqrt(
        values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
          (values.length - 1)
      );
      pcp.push({ name: variable, min, max, mean, std });
      rawData[variable] = values;
    });

    // create data for rendering the boxplot component

    return {
      type: 'boxplot',
      name: functionName,
      result: {
        success: true,
        pcp,
      },
      data: {
        id: generateId(),
        datasetName,
        variables: variableNames,
        pcp,
        rawData,
        theme: config?.theme,
        isDraggable: config?.isDraggable,
      },
    };
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: `Failed to create PCP. ${error}`,
      },
    };
  }
}
