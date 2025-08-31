// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import {
  ExtendedTool,
  OnToolCompleted,
  ToolExecutionOptions,
  Parameters,
} from './tool';

export interface LangChainTool {
  name: string;
  description: string;
  schema: Record<string, unknown>;
  func: (args: Record<string, unknown>) => Promise<unknown>;
}

export interface LangChainToolResult {
  name: string;
  description: string;
  schema: Record<string, unknown>;
  func?: (args: Record<string, unknown>) => Promise<unknown>;
}

export function getLangChainTool({
  tool,
  options: toolOptions,
}: {
  tool: ExtendedTool;
  options?: {
    toolContext?: unknown;
    onToolCompleted?: OnToolCompleted;
    isExecutable?: boolean;
  };
}): LangChainToolResult {
  // create a langchain tool.func function
  const func = async (
    args: Record<string, unknown>
  ) => {
    const toolExecutionOptions: ToolExecutionOptions = {
      toolCallId: `langchain-${Date.now()}`,
    };

    // add context to options
    const result = await tool.execute(args as never, {
      ...toolExecutionOptions,
      context: toolOptions?.toolContext,
    });

    if (toolExecutionOptions.toolCallId && toolOptions?.onToolCompleted) {
      toolOptions.onToolCompleted(toolExecutionOptions.toolCallId, result.additionalData);
    }

    return result.llmResult;
  };

  return {
    name: tool.description.split(' ')[0].toLowerCase(),
    description: tool.description,
    schema: tool.parameters,
    ...(toolOptions?.isExecutable ? { func } : {}),
  };
}

/**
 * Convert an extended tool to a LangChain tool.
 *
 * ## Example
 * ```ts
 * import { convertToLangChainTool } from '@openassistant/utils';
 * import { localQuery, LocalQueryTool } from '@openassistant/duckdb';
 *
 * const localQueryTool: LocalQueryTool = {
 *   ...localQuery,
 *   context: {
 *     getValues: (datasetName, variableName) => {
 *       return [1, 2, 3];
 *     },
 *   },
 * };
 *
 * const tool = convertToLangChainTool(localQueryTool);
 * 
 * // Use with LangChain
 * const agent = new AgentExecutor({
 *   agent: new OpenAIAgent({ llm, tools: [tool] }),
 *   tools: [tool],
 * });
 * ```
 *
 * @param extendedTool - The extended tool to convert.
 * @param isExecutable - Whether the tool is executable.
 * @returns The LangChain tool.
 */
export function convertToLangChainTool<
  PARAMETERS extends Parameters = never,
  RETURN_TYPE = never,
  ADDITIONAL_DATA = never,
  CONTEXT = unknown,
>(
  extendedTool: ExtendedTool<PARAMETERS, RETURN_TYPE, ADDITIONAL_DATA, CONTEXT>,
  { isExecutable = true }: { isExecutable?: boolean } = {}
) {
  // create a langchain tool.func function
  const func = async (
    args: Record<string, unknown>
  ) => {
    const toolExecutionOptions: ToolExecutionOptions = {
      toolCallId: `langchain-${Date.now()}`,
    };

    // add context to options
    const result = await extendedTool.execute(args as z.infer<PARAMETERS>, {
      ...toolExecutionOptions,
      context: extendedTool.context,
    });

    if (toolExecutionOptions.toolCallId && extendedTool.onToolCompleted) {
      extendedTool.onToolCompleted(toolExecutionOptions.toolCallId, result.additionalData);
    }

    return result.llmResult;
  };

  return {
    name: extendedTool.description.split(' ')[0].toLowerCase(),
    description: extendedTool.description,
    schema: extendedTool.parameters,
    ...(isExecutable ? { func } : {}),
  };
}

export function convertFromLangChainTool(
  langchainTool: LangChainTool
): ExtendedTool<Parameters, unknown, unknown, unknown> {
  const { name, description, schema, func } = langchainTool;

  return {
    description: description || '',
    parameters: schema as unknown as Parameters,
    ...(func
      ? {
          execute: async (args, options) => {
            const result = await func(args);
            return { llmResult: result };
          },
        }
      : {}),
  } as ExtendedTool<Parameters, unknown, unknown, unknown>;
}
