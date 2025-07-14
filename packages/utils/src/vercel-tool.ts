// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import { Tool } from 'ai';
import {
  ExtendedTool,
  OnToolCompleted,
  ToolExecutionOptions,
  Parameters,
} from './tool';

// export interface Tool<TContext = unknown> {
//   description: string;
//   parameters: Record<string, unknown>;
//   execute: (
//     args: Record<string, unknown>,
//     options: ToolExecutionOptions & { context?: TContext }
//   ) => Promise<{
//     llmResult: unknown;
//     additionalData?: unknown;
//   }>;
//   context?: TContext;
// }

export interface ToolResult {
  description: string;
  parameters: Record<string, unknown>;
  execute?: (
    args: Record<string, unknown>,
    options: ToolExecutionOptions
  ) => Promise<unknown>;
}

export function getTool({
  tool,
  options: toolOptions,
}: {
  tool: ExtendedTool;
  options?: {
    toolContext?: unknown;
    onToolCompleted?: OnToolCompleted;
    isExecutable?: boolean;
  };
}): ToolResult {
  // create a vercel ai tool.execute function
  const execute = async (
    args: Record<string, unknown>,
    options: ToolExecutionOptions
  ) => {
    // add context to options
    const result = await tool.execute(args as never, {
      ...options,
      context: toolOptions?.toolContext,
    });

    if (options.toolCallId && toolOptions?.onToolCompleted) {
      toolOptions.onToolCompleted(options.toolCallId, result.additionalData);
    }

    return result.llmResult;
  };

  return {
    description: tool.description,
    parameters: tool.parameters,
    ...(toolOptions?.isExecutable ? { execute } : {}),
  };
}

/**
 * Convert an extended tool to a Vercel AI tool.
 *
 * ## Example
 * ```ts
 * import { convertToVercelAiTool } from '@openassistant/utils';
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
 * const tool = localQuery({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Get the values of the variable "income" for the dataset "census"',
 *   tools: { localQuery: convertToVercelAiTool(localQueryTool) },
 * });
 * ```
 *
 * @param extendedTool - The extended tool to convert.
 * @param isExecutable - Whether the tool is executable.
 * @returns The Vercel AI tool.
 */
export function convertToVercelAiTool<
  PARAMETERS extends Parameters = never,
  RETURN_TYPE = never,
  ADDITIONAL_DATA = never,
  CONTEXT = unknown,
>(
  extendedTool: ExtendedTool<PARAMETERS, RETURN_TYPE, ADDITIONAL_DATA, CONTEXT>,
  { isExecutable = true }: { isExecutable?: boolean } = {}
) {
  // create a vercel ai tool.execute function
  const execute = async (
    args: Record<string, unknown>,
    options: ToolExecutionOptions
  ) => {
    // add context to options
    const result = await extendedTool.execute(args as z.infer<PARAMETERS>, {
      ...options,
      context: extendedTool.context,
    });

    if (options.toolCallId && extendedTool.onToolCompleted) {
      extendedTool.onToolCompleted(options.toolCallId, result.additionalData);
    }

    return result.llmResult;
  };

  return {
    description: extendedTool.description,
    parameters: extendedTool.parameters,
    ...(isExecutable ? { execute } : {}),
  };
}

export function convertFromVercelAiTool(
  vercelAiTool: Tool
): ExtendedTool<Parameters, unknown, unknown, unknown> {
  const { description, parameters, execute } = vercelAiTool;

  return {
    description: description || '',
    parameters,
    ...(execute
      ? {
          execute: async (args, options) => {
            const result = await execute(args, {
              toolCallId: options?.toolCallId || '',
              messages: [],
            });
            return { llmResult: result };
          },
        }
      : {}),
  } as ExtendedTool<Parameters, unknown, unknown, unknown>;
}
