import {
  CustomFunctionContext,
  RegisterFunctionCallingProps,
} from '@openassistant/core';
import { BoxplotCallbackMessage } from './callback-component';
import { boxplotCallbackFunction } from './callback-function';

/**
 * The function of getting the values of a variable from the dataset.
 * @param datasetName - The name of the dataset.
 * @param variableNames - The names of the variables.
 * @returns The values of the variables.
 */
type GetValues = (
  datasetName: string,
  variableName: string
) => Promise<number[]>;

/**
 * The callback function can be used to sync the selections of the boxplot with the original dataset.
 * @param datasetName - The name of the dataset.
 * @param selectedIndices - The indices of the selected data points in the boxplot.
 */
export type OnSelectedCallback = (
  datasetName: string,
  selectedIndices: number[]
) => void;

/**
 * The context of the boxplot function.
 * @param getValues - Get the values of a variable from the dataset. See {@link GetValues} for more details.
 * @param onSelected - The callback function can be used to sync the selections of the boxplot with the original dataset. See {@link OnSelectedCallback} for more details.
 * @param config - The configuration of the boxplot.
 * @param config.theme - The theme of the boxplot. The possible values are 'light' and 'dark'.
 * @param config.isDraggable - Whether the boxplot is draggable e.g. to a dashboard.
 */
export type BoxplotFunctionContext = {
  getValues: GetValues;
  onSelected?: OnSelectedCallback;
  config?: { isDraggable?: boolean; theme?: string };
};

type ValueOf<T> = T[keyof T];
type BoxplotFunctionContextValues = ValueOf<BoxplotFunctionContext>;

/**
 * Define the boxplot function for tool calling. This function can assist user to create a boxplot using the values of a variable in the dataset.
 * The values should be retrieved using the getValues() callback function.
 *
 * User can select data points in the boxplot, and the selections can be synced back to the original dataset using the onSelected() callback.
 * See {@link OnSelectedCallback} for more details.
 *
 * @param context - The context of the function. See {@link BoxplotFunctionContext} for more details.
 * @param context.getValues - Get the values of a variable from the dataset. See {@link GetValues} for more details.
 * @param context.onSelected - The callback function can be used to sync the selections of the boxplot with the original dataset. See {@link OnSelectedCallback} for more details.
 * @returns The function definition.
 */
export function boxplotFunctionDefinition(
  context: CustomFunctionContext<BoxplotFunctionContextValues>
): RegisterFunctionCallingProps {
  return {
    name: 'boxplot',
    description: 'Create a boxplot',
    properties: {
      datasetName: {
        type: 'string',
        description:
          'The name of the dataset to create a boxplot. If not provided, use the first dataset or ask user to select or upload a dataset.',
      },
      variableNames: {
        type: 'array',
        description: 'The names of the variables to create a boxplot',
        items: {
          type: 'string',
        },
      },
    },
    required: ['datasetName', 'variableNames'],
    callbackFunction: boxplotCallbackFunction,
    callbackFunctionContext: context,
    callbackMessage: BoxplotCallbackMessage,
  };
}
