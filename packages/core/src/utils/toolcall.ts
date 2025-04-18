import { ToolCall } from 'ai';
import { CustomFunctionOutputProps, CustomFunctions } from '../types';

/**
 * Sort tools by priority before execution
 * @param toolCalls Array of tool calls to sort
 * @param customFunctions Object containing all available tools
 * @returns Sorted array of tool calls
 */
function sortToolCallsByPriority(
  toolCalls: ToolCall<string, unknown>[],
  customFunctions: CustomFunctions
): ToolCall<string, unknown>[] {
  return [...toolCalls].sort((a, b) => {
    const priorityA = customFunctions[a.toolName]?.priority ?? 0;
    const priorityB = customFunctions[b.toolName]?.priority ?? 0;
    return priorityB - priorityA; // Higher priority first
  });
}

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

/**
 * Process multiple tool calls in priority order
 * @param toolCalls Array of tool calls to process
 * @param customFunctions Object containing all available tools
 * @returns Array of tool call results
 */
export async function proceedToolCalls(
  toolCalls: ToolCall<string, unknown>[],
  customFunctions: CustomFunctions
): Promise<CustomFunctionOutputProps<unknown, unknown>[]> {
  const sortedToolCalls = sortToolCallsByPriority(toolCalls, customFunctions);
  const results: CustomFunctionOutputProps<unknown, unknown>[] = [];

  for (const toolCall of sortedToolCalls) {
    const result = await proceedToolCall({
      toolCall,
      customFunctions,
      previousOutput: results,
    });
    results.push(result);
  }

  return results;
}
