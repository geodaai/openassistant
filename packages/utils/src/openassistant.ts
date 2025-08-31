// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { BaseProvider, ToolRequest, ToolResponse, ProviderTool } from './providers/base-provider';
import { ExtendedTool, Parameters } from './tool';

export interface OpenAssistantConfig {
  provider: BaseProvider;
  tools?: Record<string, ExtendedTool>;
  defaultContext?: Record<string, unknown>;
}

export interface GetToolsOptions {
  toolName: string;
  context?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
}

export interface ToolRegistry {
  [name: string]: ExtendedTool;
}

export class OpenAssistant {
  private provider: BaseProvider;
  private tools: ToolRegistry = {};
  private defaultContext: Record<string, unknown> = {};
  private providerTools: Map<string, ProviderTool> = new Map();

  constructor(config: OpenAssistantConfig) {
    this.provider = config.provider;
    if (config.tools) {
      this.registerTools(config.tools);
    }
    if (config.defaultContext) {
      this.defaultContext = config.defaultContext;
    }
  }

  /**
   * Initialize the OpenAssistant with the configured provider
   */
  async initialize(): Promise<void> {
    await this.provider.initialize(this.provider.config);
    
    // Convert all registered tools to provider-specific format
    for (const [name, tool] of Object.entries(this.tools)) {
      const providerTool = this.provider.convertTool(tool);
      this.providerTools.set(name, providerTool);
    }
  }

  /**
   * Register a tool with the OpenAssistant
   */
  registerTool(name: string, tool: ExtendedTool): void {
    this.tools[name] = tool;
    
    // Convert to provider format if already initialized
    if (this.providerTools.size > 0) {
      const providerTool = this.provider.convertTool(tool);
      this.providerTools.set(name, providerTool);
    }
  }

  /**
   * Register multiple tools at once
   */
  registerTools(tools: Record<string, ExtendedTool>): void {
    this.tools = { ...this.tools, ...tools };
    
    // Convert to provider format if already initialized
    if (this.providerTools.size > 0) {
      for (const [name, tool] of Object.entries(tools)) {
        const providerTool = this.provider.convertTool(tool);
        this.providerTools.set(name, providerTool);
      }
    }
  }

  /**
   * Get a tool by name and execute it through the provider
   */
  async getTools(options: GetToolsOptions): Promise<ToolResponse> {
    const { toolName, context = {}, parameters = {} } = options;
    
    // Check if tool exists
    if (!this.tools[toolName]) {
      throw new Error(`Tool '${toolName}' not found. Available tools: ${Object.keys(this.tools).join(', ')}`);
    }

    // Check if provider supports this tool
    if (!(await this.provider.supportsTool(toolName))) {
      throw new Error(`Provider '${this.provider.name}' does not support tool '${toolName}'`);
    }

    // Merge context with default context
    const mergedContext = { ...this.defaultContext, ...context };

    // Create tool request
    const request: ToolRequest = {
      toolName,
      context: mergedContext,
      parameters,
    };

    // Execute tool through provider
    return await this.provider.executeTool(this.tools[toolName], request);
  }

  /**
   * Get provider-specific tool schema for a tool
   */
  getToolSchema(toolName: string): Record<string, unknown> | null {
    if (!this.tools[toolName]) {
      return null;
    }
    return this.provider.getToolSchema(this.tools[toolName]);
  }

  /**
   * Get all provider-specific tool schemas
   */
  getAllToolSchemas(): Record<string, Record<string, unknown>> {
    const schemas: Record<string, Record<string, unknown>> = {};
    
    for (const [name, tool] of Object.entries(this.tools)) {
      schemas[name] = this.provider.getToolSchema(tool);
    }
    
    return schemas;
  }

  /**
   * Get available tools from the provider
   */
  async getAvailableTools(): Promise<string[]> {
    return await this.provider.getAvailableTools();
  }

  /**
   * Get metadata for a specific tool
   */
  async getToolMetadata(toolName: string): Promise<Record<string, unknown> | null> {
    return await this.provider.getToolMetadata(toolName);
  }

  /**
   * Get the current provider
   */
  getProvider(): BaseProvider {
    return this.provider;
  }

  /**
   * Get all registered tools
   */
  getRegisteredTools(): ToolRegistry {
    return { ...this.tools };
  }

  /**
   * Get provider-specific tools
   */
  getProviderTools(): Map<string, ProviderTool> {
    return new Map(this.providerTools);
  }

  /**
   * Update the default context
   */
  updateDefaultContext(context: Record<string, unknown>): void {
    this.defaultContext = { ...this.defaultContext, ...context };
  }

  /**
   * Clear the default context
   */
  clearDefaultContext(): void {
    this.defaultContext = {};
  }

  /**
   * Switch to a different provider
   */
  async switchProvider(newProvider: BaseProvider): Promise<void> {
    this.provider = newProvider;
    await this.initialize();
  }
}
