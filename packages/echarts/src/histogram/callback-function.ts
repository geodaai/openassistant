import {
  CallbackFunctionProps,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
} from '@openassistant/core';
import { HistogramOutputData } from './component/histogram-plot';
import { HistogramFunctionContext } from './definition';
import { createHistogramBins } from './component/utils';

type HistogramFunctionArgs = {
  datasetName: string;
  variableName: string;
  numberOfBins: number;
};

type HistogramOutputResult =
  | ErrorCallbackResult
  | {
      success: boolean;
      variableName: string;
      details: string;
    };

/**
 * Type guard of HistogramFunctionArgs
 */
function isHistogramFunctionArgs(data: unknown): data is HistogramFunctionArgs {
  return (
    typeof data === 'object' &&
    data !== null &&
    'datasetName' in data &&
    'variableName' in data
  );
}

export async function histogramCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<HistogramOutputResult, HistogramOutputData>
> {
  if (!isHistogramFunctionArgs(functionArgs)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid histogram function arguments.',
      },
    };
  }

  const { datasetName, variableName, numberOfBins } = functionArgs;

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

  const { getValues, onSelected, config } =
    functionContext as HistogramFunctionContext;

  let values;

  try {
    values = await getValues(datasetName, variableName);
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

  try {
    // create histogram bins
    const { counts, breaks, histogramData, barDataIndexes } =
      createHistogramBins(values, numberOfBins);

    return {
      type: 'plot',
      name: functionName,
      result: {
        success: true,
        variableName,
        details: `Histogram with ${numberOfBins} bins has been created. The bin breaks are ${breaks.join(
          ', '
        )}. The counts for each bin are ${counts.join(', ')}.`,
      },
      data: {
        datasetName,
        variableName,
        histogramData,
        barDataIndexes,
        onSelected,
        theme: config?.theme || 'dark',
        isDraggable: Boolean(config?.isDraggable),
      },
    };
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: `Failed to create histogram. ${error}`,
      },
    };
  }
}
