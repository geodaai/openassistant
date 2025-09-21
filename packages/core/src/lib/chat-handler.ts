// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  CoreMessage,
  LanguageModel,
  streamText,
  ToolSet,
} from 'ai';
import { ToolCall } from '@ai-sdk/provider-utils';
import { Message, generateId } from '@ai-sdk/ui-utils';
import { tiktokenCounterPerMessage } from '../utils/token-counter';
import { trimMessages } from '../utils/trim-messages';
import { executeToolCall } from '../utils/toolcall';

/**
 * Chat handler class to manage chat requests and responses
 */
export class ChatHandler {
  private model: LanguageModel;
  // tools registered at server side
  private tools?: ToolSet;
  // tools registered at client side
  private localTools?: ToolSet;
  private instructions?: string;
  private messageHistory: Array<CoreMessage | Message> = [];
  private maxTokens: number;
  private messageTokenCount: number[] = [];

  /**
   * @param {Object} config - Configuration object
   * @param {LanguageModel} config.model - Language model instance to use for chat
   * @param {ToolSet} [config.tools] - Optional tools configuration
   * @param {string} [config.instructions] - Optional system instructions
   */
  constructor({
    model,
    tools,
    instructions,
    maxTokens = 128 * 1024,
  }: {
    model: LanguageModel;
    tools?: ToolSet;
    instructions?: string;
    maxTokens?: number;
  }) {
    this.model = model;
    this.tools = tools;
    this.instructions = instructions;
    this.maxTokens = maxTokens;
  }

  /**
   * Processes chat requests, managing message history and token limits
   * @param {Request} req - Incoming request object
   * @returns {Promise<Response>} Streaming response
   */
  async processRequest(req: Request): Promise<Response> {
    const { message, imageBase64, tools, instructions } = await req.json();

    // update tools and instructions if provided (first time)
    if (tools) {
      this.localTools = tools;
    }

    // combine server side and client side tools
    const combinedTools = { ...this.tools, ...this.localTools };

    // update instructions if provided
    if (instructions) {
      this.instructions = instructions;
    }

    if (message) {
      if (imageBase64) {
        this.addMessageToHistory({
          role: message.role,
          content: [
            { type: 'text', text: message.content },
            { type: 'image', image: imageBase64 },
          ],
        });
      } else {
        this.addMessageToHistory(message);
      }
    }

    // trim the history by token limit
    // await this.trimHistoryByTokenLimit();

    const result = streamText({
      model: this.model,
      system: this.instructions,
      messages: this.messageHistory as CoreMessage[],
      tools: combinedTools,
      onFinish: async ({ text, toolCalls }) => {
        // handle server side tool calls
        const toolInvocations: ToolCall<string, unknown>[] = [];

        for (const toolCall of toolCalls) {
          const toolInvocation = await this.handleToolCall(toolCall);

          if (toolInvocation) {
            toolInvocations.push(toolInvocation);
          }
        }
        if (toolInvocations.length > 0 || text.length > 0) {
          // add final message to history messages array
          const message: Message = {
            id: generateId(),
            role: 'assistant',
            content: text,
            toolInvocations,
          };
          this.addMessageToHistory(message);
        }
      },
    });

    return new Response(result.textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  }

  async addMessageToHistory(message: Message | CoreMessage) {
    this.messageHistory.push(message);
    this.messageTokenCount.push(await tiktokenCounterPerMessage(message));
  }

  async handleToolCall(
    toolCall: ToolCall<string, unknown>
  ): Promise<ToolCall<string, unknown> | null> {
    // handle server side tool call
    // check if tool call is registered at server side
    const functionName = toolCall.toolName;

    if (this.tools?.[functionName]) {
      const output = await executeToolCall(toolCall, this.tools);

      return {
        toolCallId: toolCall.toolCallId,
        result: output.result,
        state: 'result',
        toolName: toolCall.toolName,
        args: toolCall.args,
      };
    }

    return null;
  }

  async trimHistoryByTokenLimit(): Promise<void> {
    // get the total token count
    const totalTokens = this.messageTokenCount.reduce(
      (acc, curr) => acc + curr,
      0
    );

    // if total tokens exceed the max tokens, trim the history
    if (totalTokens > this.maxTokens) {
      this.messageHistory = await trimMessages({
        messages: this.messageHistory,
        instructions: this.instructions || '',
        tools: this.tools || {},
        maxTokens: this.maxTokens,
      });
    }
  }

  clearHistory(): void {
    this.messageHistory = [];
    this.messageTokenCount = [];
  }
}
