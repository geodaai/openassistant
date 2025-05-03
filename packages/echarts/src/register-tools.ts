import { boxplot } from "./boxplot/tool";
import { bubbleChart } from "./bubble-chart/tool";
import { histogram } from "./histogram/tool";
import { pcp } from "./pcp/tool";
import { scatterplot } from "./scatterplot/tool";

export function registerTools() {
  return {
    boxplot,
    bubbleChart,
    histogram,
    pcp,
    scatterplot,
  };
}

interface ToolExecutionOptions {
  toolCallId: string;
  abortSignal?: AbortSignal;
}

export function getTool(name, context, onToolCompleted) {
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

export function getVercelTools() {
  const tools = registerTools();
  return Object.keys(tools).map((key) => {
    return getTool(key, {}, (toolCallId, result) => {
      console.log('toolCallId', toolCallId);
      console.log('result', result);
    });
  });
}
