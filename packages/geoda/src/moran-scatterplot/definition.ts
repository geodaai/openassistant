import {
  RegisterFunctionCallingProps,
  CustomFunctionContext,
} from '@openassistant/core';
import { moranScatterCallbackFunction } from './callback-function';
import { MoranScatterCallbackComponent } from './callback-component';
import { MoranScatterPlotFunctionContext } from './tool';

/**
 * @internal
 * @deprecated Use {@link MoranScatterPlotFunctionContext} instead.
 * 
 * The definition of the values of the Moran scatterplot function context.
 * It is a union of the values of {@link MoranScatterFunctionContext}: getValues
 *
 * See {@link MoranScatterFunctionContext} for more details.
 */
export type MoranScatterFunctionContextValues =
  MoranScatterPlotFunctionContext[keyof MoranScatterPlotFunctionContext];

/**
 * @internal
 * @deprecated Use {@link moranScatterPlot} tool instead.
 *
 * Define the scatterplot function for tool calling. This function can assist user to create a scatterplot using the values of two variables in the dataset.
 * The values of x and y should be retrieved using the getValues() callback function.
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
