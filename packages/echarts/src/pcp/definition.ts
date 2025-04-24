import {
  CustomFunctionContext,
  RegisterFunctionCallingProps,
} from '@openassistant/core';
import { parallelCoordinateCallbackFunction } from './callback-function';
import { ParallelCoordinateComponentContainer } from './component/pcp-component';
import { PCPToolContext } from './tool';

type ValueOf<T> = T[keyof T];
type PCPToolContextValues = ValueOf<PCPToolContext>;

/**
 * @internal
 * @deprecated Use `pcp` tool instead.
 *
 * ## Summary
 *
 * Defines the parallel coordinate function for LLM function calling tool.
 * You can simply pass this function to the `functions` prop in AiAssistant component,
 * and provide the callback function to get the values of the variables from your own dataset.
 * For example,
 *
 * ```tsx
 * const functions = [
 *   ...otherFunctions,
 *   parallelCoordinateFunctionDefinition({
 *     getValues: async (dataset, variable) => [1, 2, 3],
 *     config: { theme: 'light', isExpanded: true }
 *   }),
 * ];
 *
 * ...
 * <AiAssistant
 *   modelProvider="openai"
 *   model="gpt-4o"
 *   apiKey="your-api-key"
 *   functions={functions}
 * />
 * ...
 * ```
 *
 * Then, using the Ai Assistant, users can prompt to create a parallel coordinate chart. For example,
 *
 * ```
 * Can you create a parallel coordinate chart to check the relationship among the 'population', 'revenue' and 'poverty' in my dataset?
 * ```
 *
 * :::tip
 * You don't even need to mention *create a parallel coordinate chart*, if this parallel coordinate function is the only function
 * you provide to examine multiple variables,
 * the LLM will confirm with you to create a parallel coordinate chart to examine the relationship among the variables.
 * :::
 *
 * @param context - The context object used by the parallel coordinate function. See ParallelCoordinateFunctionContext for more details.
 *
 * :::note
 * You are responsible to provide the context object, which are `getValues` and `config` as shown in the example above, to the parallel coordinate function.
 * :::
 *
 * @returns {RegisterFunctionCallingProps} Configuration object for function registration
 */
export function parallelCoordinateFunctionDefinition(
  context: CustomFunctionContext<PCPToolContextValues>
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
    // @ts-expect-error - deprecated
    callbackMessage: ParallelCoordinateComponentContainer,
  };
}
