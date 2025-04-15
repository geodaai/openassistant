import {
  CallbackFunctionProps,
  CustomFunctionOutputProps,
} from '@openassistant/core';
import { runSpatialJoin, SpatialCountFunctionContext } from './tool';

type SpatialCountFunctionArgs = {
  firstDatasetName: string;
  secondDatasetName: string;
  joinVariableNames?: string[];
  joinOperators?: string[];
};

type SpatialCountOutputResult = {
  success: boolean;
  leftDatasetName?: string;
  rightDatasetName?: string;
  details: string;
};

export type SpatialCountOutputData = {
  joinResult: number[][];
  joinValues?: Record<string, number[]>;
  actionButtonLabel?: string;
  actionButtonOnClick?: () => void;
};

// type guard of SpatialCountFunctionArgs
function isSpatialCountFunctionArgs(
  data: unknown
): data is SpatialCountFunctionArgs {
  return (
    typeof data === 'object' &&
    data !== null &&
    'firstDatasetName' in data &&
    'secondDatasetName' in data
  );
}

// type guard of SpatialCountFunctionContext
function isSpatialCountFunctionContext(
  data: unknown
): data is SpatialCountFunctionContext {
  return (
    typeof data === 'object' &&
    data !== null &&
    'getGeometries' in data &&
    'getValues' in data
  );
}

export async function SpatialCountCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<SpatialCountOutputResult, SpatialCountOutputData>
> {
  if (!isSpatialCountFunctionArgs(functionArgs)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid spatial count function arguments.',
      },
    };
  }

  if (!isSpatialCountFunctionContext(functionContext)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid spatial count function context.',
      },
    };
  }

  const {
    firstDatasetName,
    secondDatasetName,
    joinVariableNames,
    joinOperators,
  } = functionArgs;
  const { getGeometries, getValues, saveAsDataset } = functionContext;

  const result = await runSpatialJoin({
    firstDatasetName,
    secondDatasetName,
    joinVariableNames,
    joinOperators,
    getGeometries,
    getValues,
  });

  return {
    type: 'success',
    name: functionName,
    result: {
      success: true,
      leftDatasetName: firstDatasetName,
      rightDatasetName: secondDatasetName,
      details: result.llmResult.result?.details ?? '',
    },
    data: {
      joinResult: result.additionalData?.joinResult ?? [],
      joinValues: result.additionalData?.joinValues ?? {},
      ...(saveAsDataset
        ? {
            actionButtonLabel: 'Save as dataset',
            actionButtonOnClick: () => {
              saveAsDataset(
                secondDatasetName,
                result.additionalData?.joinValues ?? {}
              );
            },
          }
        : {}),
    },
  };
}
