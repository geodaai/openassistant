// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { BaseProvider, ProviderConfig, ToolRequest, ToolResponse, ProviderTool } from './base-provider';
import { ExtendedTool, Parameters, ToolExecutionOptions } from '../tool';

export interface AnthropicProviderConfig extends ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  organization?: string;
}

export class AnthropicProvider implements BaseProvider {
  public name = 'anthropic';
  public config: AnthropicProviderConfig;

  constructor(config: AnthropicProviderConfig) {
    this.config = config;
  }

  async initialize(config: AnthropicProviderConfig): Promise<void> {
    this.config = { ...config };
    
    if (!this.config.apiKey) {
      throw new Error('Anthropic API key is required');
    }
  }

  convertTool(tool: ExtendedTool): ProviderTool {
    return {
      name: tool.description.split(' ')[0].toLowerCase(),
      description: tool.description,
      parameters: tool.parameters,
      execute: async (args: Record<string, unknown>) => {
        const options: ToolExecutionOptions = {
          toolCallId: `anthropic-${Date.now()}`,
        };

        const result = await tool.execute(args as never, options);
        return result.llmResult;
      },
    };
  }

  async getAvailableTools(): Promise<string[]> {
    // Anthropic supports all tools by default
    return ['*'];
  }

  async executeTool<T = unknown>(
    tool: ExtendedTool<Parameters, T, unknown, unknown>,
    request: ToolRequest
  ): Promise<ToolResponse<T>> {
    const options: ToolExecutionOptions = {
      toolCallId: `anthropic-${Date.now()}`,
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
      throw new Error(`Anthropic tool execution failed: ${error}`);
    }
  }

  async supportsTool(_toolName: string): Promise<boolean> {
    // Anthropic supports all tools
    return true;
  }

  async getToolMetadata(toolName: string): Promise<Record<string, unknown> | null> {
    return {
      provider: 'anthropic',
      supported: true,
      executionType: 'direct',
      model: this.config.model || 'claude-3-sonnet',
      organization: this.config.organization,
      toolFormat: 'anthropic-tool',
      toolName,
    };
  }

  getToolSchema(tool: ExtendedTool): Record<string, unknown> {
    // Convert to Anthropic tool use format
    return {
      type: 'tool_use',
      name: tool.description.split(' ')[0].toLowerCase(),
      description: tool.description,
      input_schema: tool.parameters,
    };
  }
}
