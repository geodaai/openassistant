// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { BaseProvider, ProviderConfig, ToolRequest, ToolResponse, ProviderTool } from './base-provider';
import { ExtendedTool, Parameters, ToolExecutionOptions } from '../tool';

export interface OpenAIProviderConfig extends ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  organization?: string;
}

export class OpenAIProvider implements BaseProvider {
  public name = 'openai';
  public config: OpenAIProviderConfig;

  constructor(config: OpenAIProviderConfig) {
    this.config = config;
  }

  async initialize(config: OpenAIProviderConfig): Promise<void> {
    this.config = { ...config };
    
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is required');
    }
  }

  convertTool(tool: ExtendedTool): ProviderTool {
    return {
      name: tool.description.split(' ')[0].toLowerCase(),
      description: tool.description,
      parameters: tool.parameters,
      execute: async (args: Record<string, unknown>) => {
        const options: ToolExecutionOptions = {
          toolCallId: `openai-${Date.now()}`,
        };

        const result = await tool.execute(args as never, options);
        return result.llmResult;
      },
    };
  }

  async getAvailableTools(): Promise<string[]> {
    // OpenAI supports all tools by default
    return ['*'];
  }

  async executeTool<T = unknown>(
    tool: ExtendedTool<Parameters, T, unknown, unknown>,
    request: ToolRequest
  ): Promise<ToolResponse<T>> {
    const options: ToolExecutionOptions = {
      toolCallId: `openai-${Date.now()}`,
    };

    try {
      const result = await tool.execute(
        request.parameters as never,
        {
          ...options,
          context: request.context,
        }
      );

      return {
        result: result.llmResult as T,
        additionalData: result.additionalData,
      };
    } catch (error) {
      throw new Error(`OpenAI tool execution failed: ${error}`);
    }
  }

  async supportsTool(_toolName: string): Promise<boolean> {
    // OpenAI supports all tools
    return true;
  }

  async getToolMetadata(toolName: string): Promise<Record<string, unknown> | null> {
    return {
      provider: 'openai',
      supported: true,
      executionType: 'direct',
      model: this.config.model || 'gpt-4',
      toolFormat: 'openai-function',
      toolName,
    };
  }

  getToolSchema(tool: ExtendedTool): Record<string, unknown> {
    // Convert to OpenAI function calling format
    return {
      type: 'function',
      function: {
        name: tool.description.split(' ')[0].toLowerCase(),
        description: tool.description,
        parameters: tool.parameters,
      },
    };
  }
}
