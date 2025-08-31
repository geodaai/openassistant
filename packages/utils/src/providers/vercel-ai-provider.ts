// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { BaseProvider, ProviderConfig, ToolRequest, ToolResponse, ProviderTool } from './base-provider';
import { ExtendedTool, Parameters, ToolExecutionOptions } from '../tool';
import { convertToVercelAiTool } from '../vercel-tool';

export interface VercelAIProviderConfig extends ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export class VercelAIProvider implements BaseProvider {
  public name = 'vercel-ai';
  public config: VercelAIProviderConfig = {};

  async initialize(config: VercelAIProviderConfig): Promise<void> {
    this.config = { ...config };
  }

  convertTool(tool: ExtendedTool): ProviderTool {
    const vercelTool = convertToVercelAiTool(tool, { isExecutable: true });
    
    return {
      name: tool.description.split(' ')[0].toLowerCase(), // Extract name from description
      description: tool.description,
      parameters: tool.parameters,
      execute: vercelTool.execute,
    };
  }

  async getAvailableTools(): Promise<string[]> {
    // Vercel AI supports all tools by default
    return ['*'];
  }

  async executeTool<T = unknown>(
    tool: ExtendedTool<Parameters, T, unknown, unknown>,
    request: ToolRequest
  ): Promise<ToolResponse<T>> {
    const vercelTool = convertToVercelAiTool(tool, { isExecutable: true });
    
    const options: ToolExecutionOptions = {
      toolCallId: `vercel-${Date.now()}`,
    };

    try {
      const result = await vercelTool.execute!(
        request.parameters || {},
        options
      );

      return {
        result: result as T,
        additionalData: undefined,
      };
    } catch (error) {
      throw new Error(`Vercel AI tool execution failed: ${error}`);
    }
  }

  async supportsTool(toolName: string): Promise<boolean> {
    // Vercel AI supports all tools
    return true;
  }

  async getToolMetadata(toolName: string): Promise<Record<string, unknown> | null> {
    return {
      provider: 'vercel-ai',
      supported: true,
      executionType: 'direct',
      toolFormat: 'vercel-ai-tool',
    };
  }

  getToolSchema(tool: ExtendedTool): Record<string, unknown> {
    // Convert to Vercel AI tool schema format
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
