import {
  CallbackFunctionProps,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
} from '@openassistant/core';
import { generateId } from '@openassistant/common';
import { ParallelCoordinateOutputData } from './component/pcp';
import { ParallelCoordinateDataProps } from './component/utils';
import { ParallelCoordinateFunctionContext } from './definition';
import { processParallelCoordinateData } from './component/utils';

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
    variableNames.forEach(async (variable) => {
      const values = await getValues(datasetName, variable);
      rawData[variable] = values;
    });

    const pcp = processParallelCoordinateData(rawData);

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
