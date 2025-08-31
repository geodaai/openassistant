// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { BaseProvider, ProviderConfig, ToolRequest, ToolResponse, ProviderTool } from './base-provider';
import { ExtendedTool, Parameters, ToolExecutionOptions } from '../tool';

export interface GoogleProviderConfig extends ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  projectId?: string;
}

export class GoogleProvider implements BaseProvider {
  public name = 'google';
  public config: GoogleProviderConfig;

  constructor(config: GoogleProviderConfig) {
    this.config = config;
  }

  async initialize(config: GoogleProviderConfig): Promise<void> {
    this.config = { ...config };
    
    if (!this.config.apiKey) {
      throw new Error('Google API key is required');
    }
  }

  convertTool(tool: ExtendedTool): ProviderTool {
    return {
      name: tool.description.split(' ')[0].toLowerCase(),
      description: tool.description,
      parameters: tool.parameters,
      execute: async (args: Record<string, unknown>) => {
        const options: ToolExecutionOptions = {
          toolCallId: `google-${Date.now()}`,
        };

        const result = await tool.execute(args as never, options);
        return result.llmResult;
      },
    };
  }

  async getAvailableTools(): Promise<string[]> {
    // Google AI supports all tools by default
    return ['*'];
  }

  async executeTool<T = unknown>(
    tool: ExtendedTool<Parameters, T, unknown, unknown>,
    request: ToolRequest
  ): Promise<ToolResponse<T>> {
    const options: ToolExecutionOptions = {
      toolCallId: `google-${Date.now()}`,
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
      throw new Error(`Google AI tool execution failed: ${error}`);
    }
  }

  async supportsTool(_toolName: string): Promise<boolean> {
    // Google AI supports all tools
    return true;
  }

  async getToolMetadata(toolName: string): Promise<Record<string, unknown> | null> {
    return {
      provider: 'google',
      supported: true,
      executionType: 'direct',
      model: this.config.model || 'gemini-pro',
      projectId: this.config.projectId,
      toolFormat: 'google-function',
      toolName,
    };
  }

  getToolSchema(tool: ExtendedTool): Record<string, unknown> {
    // Convert to Google AI function calling format
    return {
      functionDeclarations: [{
        name: tool.description.split(' ')[0].toLowerCase(),
        description: tool.description,
        parameters: tool.parameters,
      }],
    };
  }
}
