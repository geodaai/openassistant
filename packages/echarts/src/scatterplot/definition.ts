import {
  RegisterFunctionCallingProps,
  CustomFunctionContext,
} from '@openassistant/core';
import { ScatterplotCallbackFunction } from './callback-function';
import { ScatterplotComponentContainer } from './component/scatter-plot-component';
import { ScatterplotToolContext } from './tool';

/**
 * @internal
 * @deprecated Use {@link scatterplot} tool instead.
 *
 * The definition of the values of the scatterplot function context.
 * It is a union of the values of {@link ScatterplotFunctionContext}: getValues | onSelected
 *
 * See {@link ScatterplotFunctionContext} for more details.
 */
export type ScatterplotFunctionContextValues =
  ScatterplotToolContext[keyof ScatterplotToolContext];

/**
 * @internal
 * @deprecated Use {@link scatterplot} tool instead.
 *
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
    // @ts-expect-error - deprecated
    callbackMessage: ScatterplotComponentContainer,
  };
}
