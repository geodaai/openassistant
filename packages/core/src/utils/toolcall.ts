import { ToolCall } from 'ai';
import { CustomFunctionOutputProps, CustomFunctions } from '../types';

export async function proceedToolCall({
  toolCall,
  customFunctions,
  previousOutput,
}: {
  toolCall: ToolCall<string, unknown>;
  customFunctions: CustomFunctions;
  previousOutput?: CustomFunctionOutputProps<unknown, unknown>[];
}): Promise<CustomFunctionOutputProps<unknown, unknown>> {
  const functionName = toolCall.toolName;
  const functionArgs = toolCall.args as Record<string, unknown>;

  try {
    // get the registered function, context and callback message
    const { func, context, callbackMessage } = customFunctions[functionName];

    // execute the function
    const output = await func({
      functionName,
      functionArgs: functionArgs,
      functionContext: context,
      previousOutput,
    });

    return {
      ...output,
      name: functionName,
      args: functionArgs,
      customMessageCallback: callbackMessage,
    };
  } catch (err) {
    // make sure to return something back to openai when the function execution fails
    return {
      type: 'errorOutput',
      name: functionName,
      args: functionArgs,
      result: {
        success: false,
        details: `The function "${functionName}" is not executed. The error message is: ${err}`,
      },
    };
  }
}

export function createToolCallCustomMessage(
  toolCallId: string,
  output: CustomFunctionOutputProps<unknown, unknown>
) {
  if (
    output &&
    output.customMessageCallback &&
    output.result &&
    typeof output.result === 'object' &&
    'success' in output.result &&
    output.result.success === true
  ) {
    try {
      return {
        toolCallId: toolCallId,
        element: output.customMessageCallback({
          functionName: output.name,
          functionArgs: output.args || {},
          output: output,
        }),
      };
    } catch (error) {
      console.error(
        `Error creating custom message for tool call ${toolCallId}: ${error}`
      );
    }
  }
  return null;
}
