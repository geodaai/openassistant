import { dataClassify } from "./data-classify/tool";
import { lisa } from './lisa/tool';

export function registerTools() {
  return {
    dataClassify,
    lisa,
  };
}


interface ToolExecutionOptions {
  toolCallId: string;
  abortSignal?: AbortSignal;
}

// type GetVercelAiTool = (name: string, context: any, onToolCompleted: any) => {
//   description: string;
//   parameters: any;
//   execute: (args: any, options: ToolExecutionOptions) => Promise<any>;
// };

export function getVercelAiTool(name, context, onToolCompleted) {
  const tool = registerTools()[name];
  if (!tool) {
    throw new Error(`Tool "${name}" not found`);
  }

  // create a vercel ai tool.execute function
  const execute = async (
    args: Record<string, unknown>,
    options: ToolExecutionOptions
  ) => {
    // add context to options
    const result = await tool.execute(args, {
      ...options,
      context,
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