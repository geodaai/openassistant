// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { BaseProvider, ProviderConfig, ToolRequest, ToolResponse, ProviderTool } from './base-provider';
import { ExtendedTool, Parameters, ToolExecutionOptions } from '../tool';
import { convertToLangChainTool } from '../langchain-tool';

export interface LangChainProviderConfig extends ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  chainType?: 'llm' | 'agent' | 'conversation';
}

export class LangChainProvider implements BaseProvider {
  public name = 'langchain';
  public config: LangChainProviderConfig = {};

  async initialize(config: LangChainProviderConfig): Promise<void> {
    this.config = { ...config };
  }

  convertTool(tool: ExtendedTool): ProviderTool {
    const langchainTool = convertToLangChainTool(tool, { isExecutable: true });
    
    return {
      name: langchainTool.name,
      description: langchainTool.description,
      parameters: langchainTool.schema,
      execute: langchainTool.func,
    };
  }

  async getAvailableTools(): Promise<string[]> {
    // LangChain supports all tools by default
    return ['*'];
  }

  async executeTool<T = unknown>(
    tool: ExtendedTool<Parameters, T, unknown, unknown>,
    request: ToolRequest
  ): Promise<ToolResponse<T>> {
    const options: ToolExecutionOptions = {
      toolCallId: `langchain-${Date.now()}`,
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
      throw new Error(`LangChain tool execution failed: ${error}`);
    }
  }

  async supportsTool(_toolName: string): Promise<boolean> {
    // LangChain supports all tools
    return true;
  }

  async getToolMetadata(toolName: string): Promise<Record<string, unknown> | null> {
    return {
      provider: 'langchain',
      supported: true,
      executionType: 'chain',
      chainType: this.config.chainType || 'llm',
      toolFormat: 'langchain-tool',
      toolName,
    };
  }

  getToolSchema(tool: ExtendedTool): Record<string, unknown> {
    // Convert to LangChain tool format using the converter
    return convertToLangChainTool(tool, { isExecutable: true });
  }
}
