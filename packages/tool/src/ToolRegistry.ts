import { ToolExecutionOptions } from 'ai';

type ToolFunction = (
  args: unknown,
  options: ToolExecutionOptions,
  context: unknown
) => Promise<unknown>;

interface ToolPackage {
  name: string;
  tools: Record<string, ToolFunction>;
  dependencies?: string[];
}

type ExtendedToolExecutionOptions = ToolExecutionOptions & {
  context: Record<string, unknown>;
};

type ExtendedToolResult = {
  llmResult: unknown;
  additionalData: unknown;
};

type ExtendedTool = {
  description: string;
  parameters: Record<string, unknown>;
  execute: (
    args: Record<string, unknown>,
    options: ExtendedToolExecutionOptions
  ) => Promise<ExtendedToolResult>;
  context: Record<string, unknown>;
  component: React.ComponentType<unknown>;
};

class ToolRegistry {
  private static instance: ToolRegistry;
  private registeredPackages: Map<string, ToolPackage>;
  private loadedPackages: Set<string>;
  private tools: Map<string, ExtendedTool>;

  private constructor() {
    this.registeredPackages = new Map();
    this.loadedPackages = new Set();
    this.tools = new Map();
  }

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  /**
   * Register a tool package with its tools and dependencies
   */
  public registerPackage(pkg: ToolPackage): void {
    this.registeredPackages.set(pkg.name, pkg);
  }

  /**
   * Load a specific tool package and its dependencies
   * This will dynamically import the package if it's not already loaded
   */
  public async loadPackage(packageName: string): Promise<void> {
    if (this.loadedPackages.has(packageName)) {
      return;
    }

    try {
      // Dynamically import the package
      const packageModule = await import(`${packageName}`);

      if (!packageModule) {
        throw new Error(`Package "${packageName}" not found`);
      }

      // Load dependencies?

      // If the package exports a registerTools function, call it
      if (typeof packageModule.registerTools === 'function') {
        const registeredTools = await packageModule.registerTools();
        if (registeredTools && typeof registeredTools === 'object') {
          Object.entries(registeredTools).forEach(([toolName, tool]) => {
            if (tool && typeof tool === 'object') {
              this.tools.set(toolName, tool as ExtendedTool);
            }
          });
        }
      } else {
        throw new Error(
          `Package "${packageName}" does not export a registerTools function`
        );
      }

      this.loadedPackages.add(packageName);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to load package "${packageName}": ${errorMessage}`
      );
    }
  }

  /**
   * Get a tool function by name
   */
  public getTool(name: string): ExtendedTool | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all available tool packages
   */
  public getAvailablePackages(): string[] {
    return Array.from(this.registeredPackages.keys());
  }

  /**
   * Get all loaded tool packages
   */
  public getLoadedPackages(): string[] {
    return Array.from(this.loadedPackages);
  }

  /**
   * Get all available tools from loaded packages
   */
  public getAvailableTools(): string[] {
    return Array.from(this.tools.keys());
  }
}

export default ToolRegistry;
