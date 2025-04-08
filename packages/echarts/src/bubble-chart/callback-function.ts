import { CallbackFunctionProps, CustomFunctionOutputProps, ErrorCallbackResult } from "@openassistant/core";
import { BubbleChartFunctionContext } from "./definition";
import { BubbleChartOutputData } from "./component/bubble-chart";

export type BubbleChartFunctionArgs = {
  datasetName: string;
  variableX: string;
  variableY: string;
  variableSize: string;
  variableColor?: string;
};

export type BubbleChartOutputResult =
  | ErrorCallbackResult
  | {
      success: boolean;
      details: string;
    };

export function isBubbleChartFunctionArgs(
  data: unknown
): data is BubbleChartFunctionArgs {
  return typeof data === 'object' && data !== null && 'datasetName' in data
    && 'variableX' in data
    && 'variableY' in data
    && 'variableSize' in data;
}

export function isBubbleChartFunctionContext(
  data: unknown
): data is BubbleChartFunctionContext {
  return typeof data === 'object' && data !== null && 'getValues' in data;
}

/**
 * @internal @deprecated Use the `bubbleChart` tool instead.
 */
export async function BubbleChartCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<BubbleChartOutputResult, BubbleChartOutputData>
  >
{
  if (!isBubbleChartFunctionArgs(functionArgs)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid bubble chart function arguments.',
      },
    };
  }

  const { datasetName, variableX, variableY, variableSize, variableColor } = functionArgs;
  
  if (!datasetName || !variableX || !variableY || !variableSize) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Missing required arguments.', 
      },
    };
  }

  if (!isBubbleChartFunctionContext(functionContext)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Missing getValues function.',
      },
    };
  }

  const { getValues } = functionContext;
  const xData = await getValues(datasetName, variableX);
  const yData = await getValues(datasetName, variableY);
  const sizeData = await getValues(datasetName, variableSize);
  const colorData = variableColor ? await getValues(datasetName, variableColor) : null;

  return {
    type: 'success',
    name: functionName,
    result: {
      success: true,
      details: 'Bubble chart created successfully.',
    },
    data: {
      datasetName,
      data: {
        variableX: { name: variableX, values: xData },
        variableY: { name: variableY, values: yData },
        variableSize: { name: variableSize, values: sizeData },
        ...(variableColor && colorData ? { variableColor: { name: variableColor, values: colorData } } : {}),
      },
    },
  };
}