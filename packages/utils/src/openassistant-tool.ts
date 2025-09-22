// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

// Define Zod types locally to avoid dependency issues
export type ZodTypeAny = any;
export type ZodSchema = any;

// Simple zod-like object for basic validation
export const z = {
  object: (schema: Record<string, any>) => schema,
  string: () => ({ type: 'string' }),
  number: () => ({ type: 'number' }),
  boolean: () => ({ type: 'boolean' }),
  array: (item: any) => ({ type: 'array', items: item }),
  optional: (schema: any) => ({ ...schema, optional: true }),
  describe: (schema: any, description: string) => ({ ...schema, description }),
  min: (schema: any, min: number) => ({ ...schema, min }),
  max: (schema: any, max: number) => ({ ...schema, max }),
  default: (schema: any, defaultValue: any) => ({ ...schema, default: defaultValue }),
  enum: (values: string[]) => ({ type: 'enum', values }),
  infer: <T>(schema: T): T => schema,
};

export type OpenAssistantToolExecutionOptions = {
  toolCallId: string;
  abortSignal?: AbortSignal;
};

export type OpenAssistantOnToolCompleted = (
  toolCallId: string,
  additionalData?: unknown
) => void;

export type OpenAssistantExecuteFunctionResult<
  RETURN_TYPE = never,
  ADDITIONAL_DATA = never,
> = {
  llmResult: RETURN_TYPE extends never ? RETURN_TYPE : object;
  additionalData?: ADDITIONAL_DATA extends never ? ADDITIONAL_DATA : object;
};

export type OpenAssistantToolOptions<Params extends ZodTypeAny> = {
  description?: string;
  parameters?: Params;
  context?: Record<string, unknown>;
  component?: any; // React component - using any to avoid React dependency
  onToolCompleted?: OpenAssistantOnToolCompleted;
};

export abstract class OpenAssistantTool<Params extends ZodTypeAny> {
  description: string;
  parameters: Params;
  context: Record<string, unknown>;
  component?: any; // React component - using any to avoid React dependency
  onToolCompleted?: OpenAssistantOnToolCompleted;

  // Abstract methods that subclasses must implement
  protected abstract getDefaultDescription(): string;
  protected abstract getDefaultParameters(): Params;

  constructor(options: OpenAssistantToolOptions<Params> = {}) {
    this.description = options.description || this.getDefaultDescription();
    this.parameters = options.parameters || this.getDefaultParameters();
    this.context = options.context || {};
    this.component = options.component;
    this.onToolCompleted = options.onToolCompleted;
  }

  /**
   * Executes the tool's functionality.
   * @param params - Tool parameters.
   * @param options - Optional tool call options (Vercel or custom).
   */
  abstract execute(
    params: any, // z.infer<Params> - simplified for now
    options?: OpenAssistantToolExecutionOptions & { context?: Record<string, unknown> }
  ): Promise<OpenAssistantExecuteFunctionResult>;

  /**
   * Convert this tool to a Vercel AI SDK v5 compatible tool.
   * This method requires the "ai" package to be available at runtime.
   */
  public toVercelAiTool() {
    // Check if the 'ai' package is available
    try {
      // Try to import the tool function from the 'ai' package
      const ai = eval('require')('ai');
      const { tool } = ai;
      
      // Convert the OpenAssistant tool to Vercel AI SDK v5 tool format
      return tool({
        description: this.description,
        inputSchema: this.parameters, // Vercel AI SDK v5 uses 'inputSchema' instead of 'parameters'
        outputSchema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            result: { type: 'string' },
            error: { type: 'string', optional: true }
          }
        },
        execute: async (args: any, options: any) => {
          const { toolCallId } = options;
          try {
            const result = await this.execute(args, { 
              ...options, 
              context: { ...this.context, ...options.context } 
            });

            const { additionalData, llmResult } = result;

            if (additionalData && toolCallId && this.onToolCompleted) {
              this.onToolCompleted(toolCallId, additionalData);
            }

            return {
              success: true,
              result: llmResult
            };
          } catch (error) {
            console.error(`Execute tool failed: ${error}`);
            return {
              success: false,
              error: `Execute tool failed: ${error}`,
            };
          }
        },
      });
    } catch (error) {
      throw new Error('toVercelAiTool() requires the "ai" package to be installed. Please install it with: npm install ai');
    }
  }

  /**
   * Convert this tool to a LangChain-compatible tool.
   * This method requires the "@langchain/core/tools" package to be available at runtime.
   */
  public toLangchainTool() {
    throw new Error('toLangchainTool() must be implemented by the consuming package with the "@langchain/core/tools" dependency.');
  }

  /**
   * Convert this tool to an Anthropic Claude-compatible tool.
   * This method requires the "@anthropic-ai/claude-code" package to be available at runtime.
   */
  public toAnthropicTool() {
    throw new Error('toAnthropicTool() must be implemented by the consuming package with the "@anthropic-ai/claude-code" dependency.');
  }
}