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
    const { func, context, callbackMessage, component } =
      customFunctions[functionName];

    // execute the function
    const output = await func({
      functionName,
      functionArgs: functionArgs,
      functionContext: context,
      previousOutput,
    });

    const customComponent = {
      toolName: functionName,
      component: callbackMessage
        ? callbackMessage({
            functionName,
            functionArgs,
            output,
          })
        : component,
    };

    return {
      ...output,
      name: functionName,
      args: functionArgs,
      ...(customComponent ? { component: customComponent } : {}),
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
