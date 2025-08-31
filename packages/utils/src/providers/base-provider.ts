// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { ExtendedTool, Parameters } from '../tool';

export interface ProviderConfig {
  [key: string]: unknown;
}

export interface ToolRequest {
  toolName: string;
  context?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
}

export interface ToolResponse<T = unknown> {
  result: T;
  additionalData?: unknown;
}

export interface ProviderTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute?: (args: Record<string, unknown>, options?: any) => Promise<unknown>;
}

export interface BaseProvider {
  name: string;
  config: ProviderConfig;
  
  // Initialize the provider with configuration
  initialize(config: ProviderConfig): Promise<void>;
  
  // Convert OpenAssistant tools to provider-specific format
  convertTool(tool: ExtendedTool): ProviderTool;
  
  // Get available tools from this provider
  getAvailableTools(): Promise<string[]>;
  
  // Execute a tool through this provider
  executeTool<T = unknown>(
    tool: ExtendedTool<Parameters, T, unknown, unknown>,
    request: ToolRequest
  ): Promise<ToolResponse<T>>;
  
  // Check if provider supports a specific tool
  supportsTool(toolName: string): Promise<boolean>;
  
  // Get provider-specific tool metadata
  getToolMetadata(toolName: string): Promise<Record<string, unknown> | null>;
  
  // Get provider-specific tool schema
  getToolSchema(tool: ExtendedTool): Record<string, unknown>;
}
