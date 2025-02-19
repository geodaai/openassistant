import {
  CallbackFunctionProps,
  CustomFunctionContext,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
  RegisterFunctionCallingProps,
} from '@openassistant/core';

import {
  initGeoDa,
  naturalBreaks,
  quantileBreaks,
  equalIntervalBreaks,
  hinge15Breaks,
  hinge30Breaks,
  percentileBreaks,
  standardDeviationBreaks,
} from 'geoda-wasm';

/**
 * The function of getting the values of a variable from the dataset.
 * @param datasetName - The name of the dataset.
 * @param variableName - The name of the variable.
 * @returns The values of the variable.
 */
type GetValues = (datasetName: string, variableName: string) => number[];

/**
 * The context of the data classify function.
 * @param getValues - Get the values of a variable from the dataset. See {@link GetValues} for more details.
 */
export type DataClassifyFunctionContext = {
  getValues: GetValues;
};

type ValueOf<T> = T[keyof T];
export type DataClassifyFunctionContextValues =
  ValueOf<DataClassifyFunctionContext>;

/**
 * The definition of the data classify function. The function tool can be used to classify the data into k bins or classes.
 * The classification method can be one of the following types: quantile, natural breaks, equal interval, percentile, box, standard deviation, unique values.
 *
 * When user prompts e.g. *can you classify the data of population into 5 classes?*
 *
 * 1. The LLM will execute the callback function of dataClassifyFunctionDefinition, and apply data classification using the data retrived from `getValues` function.
 * 2. The result will be an array of break points, which can be used to classify the data into k bins or classes.
 * 3. The LLM will respond with the break points to the user.
 *
 * ### For example
 * ```
 * User: can you classify the data of population into 5 classes?
 * LLM:  Yes, I've used the quantile method to classify the data of population into 5 classes. The break points are [10000, 20000, 30000, 40000, 50000].
 * ```
 *
 * ### Code example
 * ```typescript
 * import { AiAssistant, dataClassifyFunctionDefinition } from "ai-assistant";
 *
 * const functionTools = [dataClassifyFunctionDefinition({
 *   getValues: (datasetName, variableName) => {
 *     // return the values of the variable from the dataset in your react app
 *     return [];
 *   }
 * })];
 *
 * <AiAssistant
 *   modelProvider="openai",
 *   modelName="gpt-4o",
 *   function={functionTools}
 * >
 * </AiAssistant>
 * ```
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

  let values;

  try {
    values = getValues(datasetName, variableName);
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: `Failed to get the values of the variable from the dataset. ${error}`,
      },
    };
  }

  await initGeoDa();

  let breakPoints;

  switch (classificationType) {
    case 'quantile':
      breakPoints = await quantileBreaks(k, values);
      break;
    case 'natural breaks':
      breakPoints = await naturalBreaks(k, values);
      break;
    case 'equal interval':
      breakPoints = await equalIntervalBreaks(k, values);
      break;
    case 'percentile':
      breakPoints = await percentileBreaks(values);
      break;
    case 'box':
      breakPoints =
        hinge === 1.5
          ? await hinge15Breaks(values)
          : await hinge30Breaks(values);
      break;
    case 'standard deviation':
      breakPoints = await standardDeviationBreaks(values);
      break;
    default:
      breakPoints = await quantileBreaks(k, values);
      break;
  }

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
      breakPoints,
    },
  };
}
