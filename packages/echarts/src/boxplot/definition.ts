import {
  CustomFunctionContext,
  RegisterFunctionCallingProps,
} from '@openassistant/core';
import { BoxplotCallbackMessage } from './callback-component';
import { boxplotCallbackFunction } from './callback-function';
import { BoxplotComponentContainer } from './component/box-plot-component';
import { GetValues } from '../types';
import { BoxplotFunctionContext } from './tool';

type ValueOf<T> = T[keyof T];
type BoxplotFunctionContextValues = ValueOf<BoxplotFunctionContext>;

/**
 * @internal
 * @deprecated Use {@link boxplotTool} instead.
 *
 * Define the boxplot function for tool calling. This function can assist user to create a boxplot using the values of a variable in the dataset.
 * The values should be retrieved using the getValues() callback function.
 */
export const BoxplotFunction = {
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
    boundIQR: {
      type: 'number',
      description:
        'The bound of the IQR to create a boxplot. The default value is 1.5.',
    },
  },
  required: ['datasetName', 'variableNames', 'boundIQR'],
};

/**
 * @internal
 * @deprecated Use {@link boxplotTool} instead.
 *
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
  context: CustomFunctionContext<BoxplotFunctionContextValues>,
  callbackMessage = BoxplotCallbackMessage
): RegisterFunctionCallingProps {
  return {
    ...BoxplotFunction,

    callbackFunction: boxplotCallbackFunction,
    callbackFunctionContext: context,
    callbackMessage,
  };
}

/**
 * @internal
 * @deprecated Use {@link boxplotTool} instead.
 *
 * Properties for configuring the boxplot tool.
 */
export type BoxplotToolProps = {
  getValues: GetValues;
  tool?: RegisterFunctionCallingProps;
  config?: { isDraggable?: boolean; theme?: string };
  boxplotComponent?: () => React.ReactNode;
};

/**
 * @internal
 * @deprecated Use {@link boxplotTool} instead.
 *
 * This function creates a boxplot tool, which can be used to create a box plot using natural language prompts, e.g. *"Create a box plot of the variable 'age'"*.
 *
 * To use this tool, you need to provide the implementation of the `getValues` function.
 * This function will be used to retrieve the values of the variable from the dataset.
 * Note: the values are only used to create the box plot, and are not sent to the LLM.
 *
 * For example:
 *
 * ```ts
 * const functions = [
 *   ...,
 *   boxplotTool({
 *     getValues: async (datasetName, variableName) => {
 *       // retrieve the values of the variable from the dataset
 *       return datasets[datasetName][variableName];
 *     },
 *   }),
 * ];
 * ```
 *
 * You can also provide a custom React component to render the box plot.
 * See {@link BoxplotToolProps} for more details.
 *
 * The default definition of this boxplot tool is {@link BoxplotFunction}.
 * You can override the default definition by providing the `tool` property.
 *
 * @param props - The properties of the boxplot tool. See {@link BoxplotToolProps} for more details.
 * @returns The function definition.
 */
export function boxplotTool({
  tool,
  getValues,
  config,
  boxplotComponent,
}: BoxplotToolProps): RegisterFunctionCallingProps {
  const context: CustomFunctionContext<BoxplotFunctionContextValues> = {
    getValues,
    config: {
      isDraggable: false,
      ...config,
    },
  };
  return {
    ...(tool || BoxplotFunction),
    callbackFunction: boxplotCallbackFunction,
    callbackFunctionContext: context,
    // @ts-expect-error - deprecated
    callbackMessage: boxplotComponent || BoxplotComponentContainer,
  };
}
