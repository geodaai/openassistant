import {
  CallbackFunctionProps,
  CustomFunctionContext,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
  RegisterFunctionCallingProps,
} from '@openassistant/core';

import { DataClassifyFunctionContext, runDataClassify } from './tool';

type ValueOf<T> = T[keyof T];
export type DataClassifyFunctionContextValues =
  ValueOf<DataClassifyFunctionContext>;

/**
 * @internal
 * @deprecated Use {@link dataClassify} tool instead.
 * @param context - The context of the data classify function. See {@link DataClassifyFunctionContextValues} for more details.
 * @returns The definition of the data classify function.
 */
export function dataClassifyFunctionDefinition(
  context: CustomFunctionContext<DataClassifyFunctionContextValues>
): RegisterFunctionCallingProps {
  return {
    name: 'dataClassify',
    description:
      'Classify the data by grouping the values into k bins or classes.',
    properties: {
      classificationType: {
        type: 'string',
        description:
          'The name of the classification type or classification method. It should be one of the following types: quantile, natural breaks, equal interval, percentile, box, standard deviation. The default value is quantile.',
      },
      k: {
        type: 'number',
        description:
          'The number of bins or classes that the numeric values will be groupped into. The default value of k is 5.',
      },
      variableName: {
        type: 'string',
        description: 'The variable name.',
      },
      hinge: {
        type: 'number',
        description:
          'This property is only for box map. This numeric value defines the lower and upper edges of the box known as hinges. It could be either 1.5 or 3.0, and the default value is 1.5',
      },
      datasetName: {
        type: 'string',
        description:
          'The name of the dataset.  If not provided, use the first dataset or ask user to select or upload a dataset.',
      },
    },
    required: ['classificationType', 'variableName'],
    callbackFunction: dataClassifyCallbackFunction,
    callbackFunctionContext: context,
  };
}

type DataClassifyFunctionArgs = {
  datasetName: string;
  variableName: string;
  classificationType: string;
  k?: number;
  hinge?: number;
};

type DataClassifyOutputResult =
  | ErrorCallbackResult
  | {
      datasetName: string;
      variableName: string;
      classificationType: string;
      k: number;
      hinge?: number;
      breakPoints: number[];
    };

async function dataClassifyCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<DataClassifyOutputResult, unknown>
> {
  const {
    datasetName,
    variableName,
    classificationType,
    k = 5,
    hinge = 1.5,
  } = functionArgs as DataClassifyFunctionArgs;

  const { getValues } = functionContext as DataClassifyFunctionContext;

  if (!datasetName || !variableName) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Dataset name and variable name are required.',
      },
    };
  }

  const result = await runDataClassify({
    datasetName,
    variableName,
    method: classificationType,
    k,
    hinge,
    getValues,
  });

  return {
    type: 'plot',
    name: functionName,
    result: {
      success: true,
      datasetName,
      variableName,
      classificationType,
      k,
      hinge,
      breakPoints: result.llmResult.result?.breaks,
    },
  };
}
