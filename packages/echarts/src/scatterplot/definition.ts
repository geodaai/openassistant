import { RegisterFunctionCallingProps } from '@openassistant/core';
import { CustomFunctionContext } from '@openassistant/core';
import { ScatterplotCallbackFunction } from './callback-function';
import { ScatterplotCallbackComponent } from './callback-component';

/**
 * The callback function can be used to retrieve the values of two variables from the dataset.
 *
 * @param datasetName - The name of the dataset.
 * @param xVariableName - The name of the x variable, which will be returned from LLM.
 * @param yVariableName - The name of the y variable, which will be returned from LLM.
 * @returns The values of the two variables.
 */
type GetValues = (
  datasetName: string,
  xVariableName: string,
  yVariableName: string
) => Promise<{ x: number[]; y: number[] }>;

/**
 * The callback function can be used to sync the selections of the scatterplot with the original dataset.
 *
 * @param datasetName - The name of the dataset.
 * @param selectedIndices - The indices of the selected points.
 */
type OnSelectedCallback = (
  datasetName: string,
  selectedIndices: number[]
) => void;

/**
 * The context of the scatterplot function. The context will be used by the function calling to create the scatterplot.
 *
 * @param getValues - Get the values of two variables from the dataset. See {@link GetValues} for more details.
 * @param onSelected - The callback function can be used to sync the selections of the scatterplot with the original dataset. See {@link OnSelectedCallback} for more details.
 * @param filteredIndex - The indices of the selected points.
 * @param config - The configuration of the scatterplot.
 * @param config.isDraggable - The flag to indicate if the scatterplot is draggable.
 * @param config.theme - The theme of the scatterplot. The possible values are 'light' and 'dark'.
 */
export type ScatterplotFunctionContext = {
  getValues: GetValues;
  onSelected: OnSelectedCallback;
  filteredIndex?: number[];
  config?: { isDraggable?: boolean; theme?: string };
};

/**
 * The definition of the values of the scatterplot function context.
 * It is a union of the values of {@link ScatterplotFunctionContext}: getValues | onSelected
 *
 * See {@link ScatterplotFunctionContext} for more details.
 */
export type ScatterplotFunctionContextValues =
  ScatterplotFunctionContext[keyof ScatterplotFunctionContext];

/**
 * Define the scatterplot function for tool calling. This function can assist user to create a scatterplot using the values of two variables in the dataset.
 * The values of x and y should be retrieved using the getValues() callback function.
 *
 * User can select the points in the scatterplot, and the selections can be synced back to the original dataset using the onSelected() callback.
 * See {@link OnSelectedCallback} for more details.
 *
 * @param context - The context of the function. See {@link ScatterplotFunctionContext} for more details.
 * @param context.getValues - Get the values of two variables from the dataset. See {@link GetValues} for more details.
 * @param context.onSelected - The callback function can be used to sync the selections of the scatterplot with the original dataset. See {@link OnSelectedCallback} for more details.
 * @returns The function definition.
 */
export function scatterplotFunctionDefinition(
  context: CustomFunctionContext<ScatterplotFunctionContextValues>
): RegisterFunctionCallingProps {
  return {
    name: 'scatterplot',
    description: 'Create a scatterplot',
    properties: {
      datasetName: {
        type: 'string',
        description:
          'The name of the dataset to create a scatterplot. If not provided, use the first dataset or ask user to select or upload a dataset.',
      },
      xVariableName: {
        type: 'string',
        description: 'The name of the x variable.',
      },
      yVariableName: {
        type: 'string',
        description: 'The name of the y variable.',
      },
    },
    required: ['datasetName', 'xVariableName', 'yVariableName'],
    callbackFunction: ScatterplotCallbackFunction,
    callbackFunctionContext: context,
    callbackMessage: ScatterplotCallbackComponent,
  };
}
