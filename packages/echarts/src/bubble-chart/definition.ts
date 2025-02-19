import {
  RegisterFunctionCallingProps,
  CustomFunctionContext,
} from '@openassistant/core';
import { GetValues } from '../histogram/definition';
import { BubbleChartCallbackFunction } from './callback-function';
import { BubbleChartCallbackMessage } from './callback-component';

/**
 * Configuration context for the bubble chart visualization
 *
 * @property {GetValues} getValues - Function to retrieve variable values from dataset
 * @property {Object} [config] - Optional configuration settings
 * @property {boolean} [config.isDraggable] - Enables drag functionality for dashboard integration
 * @property {('light'|'dark')} [config.theme] - Visual theme for the bubble chart
 */
export type BubbleChartFunctionContext = {
  getValues: GetValues;
  config?: { isDraggable?: boolean; theme?: string };
};

export type BubbleChartFunctionContextValues =
  BubbleChartFunctionContext[keyof BubbleChartFunctionContext];

/**
 * ## Summary
 *
 * Defines the bubble chart function for LLM function calling tool.
 * You can simply pass this function to the `functions` prop in AiAssistant component,
 * and provide the callback function to get the values of the variables from your own dataset.
 * For example,
 *
 * ```tsx
 * const functions = [
 *   ...otherFunctions,
 *   bubbleChartFunctionDefinition({
 *     getValues: async (dataset, variable) => [1, 2, 3],
 *     config: { theme: 'light' }
 *   }),
 * ];
 *
 * ...
 * <AiAssistant
 *   modelProvider="openai"
 *   model="gpt-4"
 *   apiKey="your-api-key"
 *   functions={functions}
 * />
 * ...
 * ```
 *
 * Then, using the Ai Assistant, users can prompt to create a bubble chart. For example,
 *
 * ```
 * Can you create a bubble chart to visualize the relationship between GDP, Life Expectancy, and Population in my dataset?
 * ```
 *
 * :::tip
 * The bubble chart is particularly useful for visualizing relationships between three or four variables,
 * where X and Y coordinates represent two variables, bubble size represents a third variable,
 * and optionally, bubble color can represent a fourth variable.
 * :::
 *
 * @param context - The context object used by the bubble chart function. See [BubbleChartFunctionContext](../type-aliases/BubbleChartFunctionContext.md) for more details.
 *
 * :::note
 * You are responsible to provide the context object, which are `getValues` and `config` as shown in the example above, to the bubble chart function.
 * :::
 *
 * @returns {RegisterFunctionCallingProps} Configuration object for function registration
 */
export function bubbleChartFunctionDefinition(
  context: CustomFunctionContext<BubbleChartFunctionContextValues>
): RegisterFunctionCallingProps {
  return {
    name: 'bubbleChart',
    description:
      'Creates a bubble chart showing relationships between three variables, where X and Y coordinates represent two variables and bubble size represents a third variable. Optionally colors bubbles based on a fourth variable.',
    properties: {
      datasetName: {
        type: 'string',
        description: 'Name of the dataset containing the variables.',
      },
      variableX: {
        type: 'string',
        description: 'Variable to plot on the X-axis.',
      },
      variableY: {
        type: 'string',
        description: 'Variable to plot on the Y-axis.',
      },
      variableSize: {
        type: 'string',
        description: 'Variable to represent as bubble size.',
      },
      variableColor: {
        type: 'string',
        description: 'Optional variable to represent as bubble color.',
      },
    },
    required: ['datasetName', 'variableX', 'variableY', 'variableSize'],
    callbackFunction: BubbleChartCallbackFunction,
    callbackFunctionContext: context,
    callbackMessage: BubbleChartCallbackMessage,
  };
}
