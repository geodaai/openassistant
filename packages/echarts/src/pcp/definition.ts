import {
  CustomFunctionContext,
  RegisterFunctionCallingProps,
} from '@openassistant/core';
import { ParallelCoordinateCallbackMessage } from './callback-component';
import { parallelCoordinateCallbackFunction } from './callback-function';

/**
 * Function signature for retrieving variable values from a dataset.
 *
 * @note Users should implement this function to retrieve the values of a variable from their own dataset e.g. database.
 *
 * @param datasetName - Name of the target dataset
 * @param variableName - Name of the variable to retrieve
 * @returns Promise containing an array of numeric values
 */
type GetValues = (
  datasetName: string,
  variableName: string
) => Promise<number[]>;

/**
 * Configuration context for the parallel coordinate visualization
 * @interface ParallelCoordinateFunctionContext
 * @property {GetValues} getValues - Function to retrieve variable values from dataset
 * @property {Object} [config] - Optional configuration settings
 * @property {boolean} [config.isDraggable] - Enables drag functionality for dashboard integration
 * @property {('light'|'dark')} [config.theme] - Visual theme for the parallel coordinate
 */
export type ParallelCoordinateFunctionContext = {
  getValues: GetValues;
  config?: { isDraggable?: boolean; theme?: string };
};

type ValueOf<T> = T[keyof T];
type ParallelCoordinateFunctionContextValues =
  ValueOf<ParallelCoordinateFunctionContext>;

/**
 * Defines the parallel coordinate function for tool calling
 * @param context - Function execution context
 * @returns {RegisterFunctionCallingProps} Configuration object for function registration
 *
 * @example
 * const functions = [
 *   ...otherFunctions,
 *   parallelCoordinateFunctionDefinition({
 *     getValues: async (dataset, variable) => [1, 2, 3],
 *     config: { theme: 'light' }
 *   }),
 * ];
 */
export function parallelCoordinateFunctionDefinition(
  context: CustomFunctionContext<ParallelCoordinateFunctionContextValues>
): RegisterFunctionCallingProps {
  return {
    name: 'parallelCoordinate',
    description: 'Create a parallel coordinate or PCP',
    properties: {
      datasetName: {
        type: 'string',
        description:
          'The name of the dataset. If not provided, use the first dataset or ask user to select or upload a dataset.',
      },
      variableNames: {
        type: 'array',
        description: 'The names of the variables.',
        items: {
          type: 'string',
        },
      },
    },
    required: ['datasetName', 'variableNames'],
    callbackFunction: parallelCoordinateCallbackFunction,
    callbackFunctionContext: context,
    callbackMessage: ParallelCoordinateCallbackMessage,
  };
}
