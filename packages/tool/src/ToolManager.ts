import ToolRegistry from './ToolRegistry';
import { Tool, ToolExecutionOptions } from 'ai';

class ToolManager {
  private tools: Map<string, { context: unknown; component: unknown }>;
  private toolResults: Map<string, unknown>;
  private registry: ToolRegistry;
  private toolCallIds: Map<string, string>;

  constructor() {
    this.tools = new Map();
    this.toolResults = new Map();
    this.toolCallIds = new Map();
    this.registry = ToolRegistry.getInstance();
  }

  /**
   * Load a specific tool package
   */
  async loadPackage(packageName: string): Promise<void> {
    await this.registry.loadPackage(packageName);
  }

  /**
   * Returns a wrapped tool function that captures context and stores results.
   */
  getTool(
    name: string,
    context: Record<string, unknown>,
    component?: unknown
  ): Tool {
    const tool = this.registry.getTool(name);
    if (!tool) {
      throw new Error(`Tool "${name}" not found`);
    }

    // Store metadata
    this.tools.set(name, { context, component });

    // create a vercel ai tool.execute function
    const execute = async (
      args: Record<string, unknown>,
      options: ToolExecutionOptions
    ) => {
      // add context to options
      const result = await tool.execute(args, {
        ...options,
        context,
      });

      if (options.toolCallId) {
        // store tool result by toolCallId
        this.toolResults.set(options.toolCallId, result.additionalData);
        // store toolCallId: toolName
        this.toolCallIds.set(options.toolCallId, name);
      }

      return result.llmResult;
    };

    return {
      description: tool.description,
      parameters: tool.parameters,
      execute,
    };
  }

  /**
   * Retrieve result by toolCallId.
   */
  getToolResult(toolCallId: string): unknown {
    return this.toolResults.get(toolCallId);
  }

  /**
   * Retrieve component (browser use).
   */
  getComponent(toolCallId: string): unknown {
    const toolName = this.toolCallIds.get(toolCallId);
    if (!toolName) {
      throw new Error(`Tool call id "${toolCallId}" not found`);
    }
    return this.tools.get(toolName)?.component ?? null;
  }

  /**
   * Get all available tool packages
   */
  getAvailablePackages(): string[] {
    return this.registry.getAvailablePackages();
  }

  /**
   * Get all loaded tool packages
   */
  getLoadedPackages(): string[] {
    return this.registry.getLoadedPackages();
  }

  /**
   * Get all available tools from loaded packages
   */
  getAvailableTools(): string[] {
    return this.registry.getAvailableTools();
  }
}

export default ToolManager;
