import {
  CustomFunctionContext,
  RegisterFunctionCallingProps,
} from '@openassistant/core';
import { histogramCallbackFunction } from './callback-function';
import { HistogramComponentContainer } from './component/histogram-component';

/**
 * Function signature for retrieving variable values from a dataset.
 *
 * :::note
 * Users should implement this function to retrieve the values of a variable from their own dataset e.g. database.
 * :::
 *
 * @param datasetName - Name of the target dataset
 * @param variableName - Name of the variable to retrieve
 * @returns Promise containing an array of numeric values
 */
export type GetValues = (
  datasetName: string,
  variableName: string
) => Promise<number[]>;

/**
 * The callback function can be used to sync the selections of the histogram plot with the original dataset.
 * @param datasetName - The name of the dataset.
 * @param selectedIndices - The indices of the selected bars in the histogram plot.
 */
type OnSelectedCallback = (
  datasetName: string,
  selectedIndices: number[]
) => void;

/**
 * The context of the histogram function.
 * @param getValues - Get the values of a variable from the dataset. See {@link GetValues} for more details.
 * @param onSelected - The callback function can be used to sync the selections of the histogram plot with the original dataset. See {@link OnSelectedCallback} for more details.
 * @param config - The configuration of the histogram plot.
 * @param config.theme - The theme of the histogram plot. The possible values are 'light' and 'dark'.
 * @param config.isDraggable - Whether the histogram plot is draggable e.g. to a dashboard.
 */
export type HistogramFunctionContext = {
  getValues: GetValues;
  onSelected?: OnSelectedCallback;
  config?: { isDraggable?: boolean; theme?: string };
};

type ValueOf<T> = T[keyof T];
type HistogramFunctionContextValues = ValueOf<HistogramFunctionContext>;

/**
 * Define the histogram function for tool calling. This function can assist user to create a histogram plot using the values of a variable in the dataset.
 * The values should be retrieved using the getValues() callback function.
 *
 * User can select the bars in the histogram plot, and the selections can be synced back to the original dataset using the onSelected() callback.
 * See {@link OnSelectedCallback} for more details.
 *
 * @param context - The context of the function. See {@link HistogramFunctionContext} for more details.
 * @param context.getValues - Get the values of a variable from the dataset. See {@link GetValues} for more details.
 * @param context.onSelected - The callback function can be used to sync the selections of the histogram plot with the original dataset. See {@link OnSelectedCallback} for more details.
 * @returns The function definition.
 */
export function histogramFunctionDefinition(
  context: CustomFunctionContext<HistogramFunctionContextValues>
): RegisterFunctionCallingProps {
  return {
    name: 'histogram',
    description: 'Create a histogram plot',
    properties: {
      datasetName: {
        type: 'string',
        description:
          'The name of the dataset to create a histogram plot. If not provided, use the first dataset or ask user to select or upload a dataset.',
      },
      variableName: {
        type: 'string',
        description: 'The name of the variable to create a histogram plot',
      },
      numberOfBins: {
        type: 'number',
        description:
          'The number of bins to create in the histogram. Default value is 5.',
      },
    },
    required: ['datasetName', 'variableName'],
    callbackFunction: histogramCallbackFunction,
    callbackFunctionContext: context,
    // @ts-expect-error - deprecated
    callbackMessage: HistogramComponentContainer,
  };
}
