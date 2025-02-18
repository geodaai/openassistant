import { RegisterFunctionCallingProps } from '@openassistant/core';
import { CustomFunctionContext } from '@openassistant/core';
import { moranScatterCallbackFunction } from './callback-function';
import { MoranScatterCallbackComponent } from './callback-component';
import { WeightsMeta } from 'geoda-wasm';

export type GetWeights = (weightsId: string) => {
  weights: number[][];
  weightsMeta: WeightsMeta;
};

/**
 * Function signature for retrieving variable values from a dataset.
 *
 * @note Users should implement this function to retrieve the values of a variable from their own dataset e.g. database.
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
 * The context of the scatterplot function. The context will be used by the function calling to create the scatterplot.
 *
 * @param getValues - Get the values of two variables from the dataset. See {@link GetValues} for more details.
 * @param config - The configuration of the scatterplot.
 * @param config.isDraggable - The flag to indicate if the scatterplot is draggable.
 * @param config.theme - The theme of the scatterplot. The possible values are 'light' and 'dark'.
 */
export type MoranScatterFunctionContext = {
  getValues: GetValues;
  getWeights: GetWeights;
  config?: { isDraggable?: boolean; theme?: string };
};

/**
 * The definition of the values of the Moran scatterplot function context.
 * It is a union of the values of {@link MoranScatterFunctionContext}: getValues
 *
 * See {@link MoranScatterFunctionContext} for more details.
 */
export type MoranScatterFunctionContextValues =
  MoranScatterFunctionContext[keyof MoranScatterFunctionContext];

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
export function moranScatterFunctionDefinition(
  context: CustomFunctionContext<MoranScatterFunctionContextValues>
): RegisterFunctionCallingProps {
  return {
    name: 'moranScatter',
    description: "Create a Moran's I scatterplot",
    properties: {
      datasetName: {
        type: 'string',
        description: 'The name of the dataset.',
      },
      variableName: {
        type: 'string',
        description: 'The name of the variable.',
      },
      weightsId: {
        type: 'string',
        description:
          'The id of a spatial weights. It can be created using function tool "createWeights". If id not provided, please try to create a weights first.',
      },
    },
    required: ['datasetName', 'variableName'],
    callbackFunction: moranScatterCallbackFunction,
    callbackFunctionContext: context,
    callbackMessage: MoranScatterCallbackComponent,
  };
}
