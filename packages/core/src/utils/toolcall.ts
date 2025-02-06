import { ToolCall } from 'ai';
import { ReactNode } from 'react';
import { CustomFunctionOutputProps, CustomFunctions } from '../types';

export async function proceedToolCall({
  toolCall,
  customFunctions,
}: {
  toolCall: ToolCall<string, unknown>;
  customFunctions: CustomFunctions;
}) {
  // only one ToolCall allowed
  const functionOutput: CustomFunctionOutputProps<unknown, unknown>[] = [];
  let customMessage: ReactNode | null = null;

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
      previousOutput: functionOutput,
    });

    // store the output
    functionOutput.push({
      ...output,
      name: functionName,
      args: functionArgs,
      customMessageCallback: callbackMessage,
    });
  } catch (err) {
    // make sure to return something back to openai when the function execution fails
    functionOutput.push({
      type: 'errorOutput',
      name: functionName,
      args: functionArgs,
      result: {
        success: false,
        details: `The function "${functionName}" is not executed. The error message is: ${err}`,
      },
    });
  }

  // add custom reponse message from last functionOutput
  const lastOutput = functionOutput[functionOutput.length - 1];
  if (lastOutput.customMessageCallback) {
    customMessage = lastOutput.customMessageCallback({
      functionName: lastOutput.name,
      functionArgs: lastOutput.args || {},
      output: lastOutput,
    });
  }

  // return the tool result
  return { customMessage, toolResult: lastOutput.result };
}
