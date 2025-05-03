export interface ToolExecutionOptions {
  toolCallId: string;
  abortSignal?: AbortSignal;
}

export interface Tool<TContext = unknown> {
  description: string;
  parameters: Record<string, unknown>;
  execute: (
    args: Record<string, unknown>,
    options: ToolExecutionOptions & { context: TContext }
  ) => Promise<{
    llmResult: unknown;
    additionalData?: unknown;
  }>;
}

export interface ToolResult {
  description: string;
  parameters: Record<string, unknown>;
  execute: (
    args: Record<string, unknown>,
    options: ToolExecutionOptions
  ) => Promise<unknown>;
}

export type OnToolCompleted = (
  toolCallId: string,
  additionalData?: unknown
) => void;

export function getTool<TContext = unknown>(
  tool: Tool<TContext>,
  toolContext: TContext,
  onToolCompleted: OnToolCompleted
): ToolResult {
  // create a vercel ai tool.execute function
  const execute = async (
    args: Record<string, unknown>,
    options: ToolExecutionOptions
  ) => {
    // add context to options
    const result = await tool.execute(args, {
      ...options,
      context: toolContext,
    });

    if (options.toolCallId) {
      onToolCompleted(options.toolCallId, result.additionalData);
    }

    return result.llmResult;
  };

  return {
    description: tool.description,
    parameters: tool.parameters,
    execute,
  };
}
