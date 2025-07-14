// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { CoreMessage, ToolCall, ToolSet } from 'ai';

export async function executeToolCall(
  toolCall: ToolCall<string, unknown>,
  tools: ToolSet,
  messages?: CoreMessage[],
  abortSignal?: AbortSignal
) {
  const { toolName, args, toolCallId } = toolCall;
  const tool = tools[toolName];
  if (!tool) {
    throw new Error(`Tool ${toolName} not found`);
  }

  if (typeof tool.execute !== 'function') {
    throw new Error(`Tool ${toolName} does not have an execute function`);
  }

  // execute the vercel ai tool
  const result = await tool.execute(args, {
    toolCallId,
    messages: messages || [],
    abortSignal,
  });

  return result;
}
