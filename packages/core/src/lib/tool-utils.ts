import { jsonSchema, tool, Tool, ToolSet } from 'ai';

/**
 * Converts OpenAI tool format to Vercel AI SDK tool format
 * @param {ToolSet} tools - Object containing OpenAI function tools
 * @returns {ToolSet} Converted tools in Vercel AI SDK format
 * @throws {Error} If any tool is not of type 'function'
 */
export function convertOpenAIToolsToVercelTools(tools: ToolSet) {
  const vercelTools: ToolSet = {};

  Object.keys(tools).forEach((toolName: string) => {
    const functionTool = tools[toolName];
    if (functionTool.type !== 'function') {
      throw new Error('Tool is not a function');
    }
    const typedTool: Tool = tool({
      description: functionTool.description,
      parameters: jsonSchema({
        ...functionTool.parameters,
      }),
    });

    vercelTools[toolName] = typedTool;
  });

  return vercelTools;
}
