import { toJsonSchema } from 'openai-zod-functions';
import { Schema } from '@ai-sdk/ui-utils';
import { z } from 'zod';

import { GetAssistantModelByProvider } from '../lib/model-utils';
import { UseAssistantProps } from '../hooks/use-assistant';
import {
  CallbackFunctionProps,
  CustomFunctionContext,
  CustomFunctionContextCallback,
  RegisterFunctionCallingProps,
} from '../types';
import { Tool, ToolExecutionOptions } from 'ai';

type Parameters = z.ZodTypeAny | Schema<unknown>;

export type inferParameters<PARAMETERS extends Parameters> =
  PARAMETERS extends Schema<unknown>
    ? PARAMETERS['_type']
    : PARAMETERS extends z.ZodTypeAny
      ? z.infer<PARAMETERS>
      : never;

/**
 * Represents the result of executing a custom function
 */
type ExecuteFunctionResult = {
  /**
   * The formatted result string that will be sent back to the LLM
   * @type {object}
   */
  llmResult: object;
  /**
   * Additional data returned by the function that can be used by the UI
   * @type {object}
   */
  additionalData?: object;
};

/**
 * Represents the function that will be called when the tool is executed
 * @param PARAMETERS - The parameters of the tool
 * @returns The function that will be called when the tool is executed
 */
type ExecuteFunction<PARAMETERS extends Parameters> = (
  /**
   * The arguments of the tool
   */
  args: inferParameters<PARAMETERS>,
  /**
   * The options of the tool. It can be a custom function context or a tool execution options
   * @type {ToolExecutionOptions}
   */
  options:
    | {
        /**
         * The context of the tool
         * @type {CustomFunctionContext<unknown> | CustomFunctionContextCallback<unknown>}
         */
        context?:
          | CustomFunctionContext<unknown>
          | CustomFunctionContextCallback<unknown>;
      }
    | ToolExecutionOptions
) => PromiseLike<ExecuteFunctionResult>;

/**
A tool contains the description and the schema of the input that the tool expects.
This enables the language model to generate the input.
ExtendedTool extends the Tool type from Vercel AI SDK: https://sdk.vercel.ai/docs/reference/ai-sdk-core/tool#tool.tool

The tool can also contain:
- an optional execute function for the actual execution function of the tool.
- an optional context for providing additional data for the tool execution.
- an optional component for rendering additional information (e.g. chart or map) of LLM response.
 */
export type ExtendedTool<PARAMETERS extends Parameters = never> =
  Tool<PARAMETERS> & {
    /** test */
    execute: ExecuteFunction<PARAMETERS>;
    /**
     * The context that will be passed to the function
     */
    context?:
      | CustomFunctionContext<unknown>
      | CustomFunctionContextCallback<unknown>;
    /**
     * The component that will be rendered when the tool is executed
     * @type {React.ReactNode}
     */
    component?: React.ElementType;
  };

/**
 * Extends the vercel AI tool (see https://sdk.vercel.ai/docs/reference/ai-sdk-core/tool) with additional properties:
 * 
 * - **execute**: updated execute function that returns `{llmResult, output}`, where `llmResult` will be sent back to the LLM and `output` (optional) will be used for next tool call or tool component rendering
 * - **context**: get additional context for the tool execution, e.g. data that needs to be fetched from the server 
 * - **component**: tool component (e.g. chart or map) can be rendered as additional information of LLM response
 * 
 * ### Example: 
 * 
 * ```ts
 * {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => {
        // get the weather from the weather API
        // the result should contains llmResult and output
        // `llmResult` will be sent back to the LLM
        // `output` (optional) will be used for next tool call or tool component rendering
        return {
          llmResult: 'Weather in ' + location,
          output: {
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          },
        };
      },
    }),
  },
 * ```
 * 
 * @param tool - The vercel AI tool to extend
 * @returns The extended tool
 */
export function tool<PARAMETERS extends Parameters = never>(
  /**
   * The vercel AI tool to extend
   * @type {ExtendedTool<PARAMETERS>}
   */
  tool: ExtendedTool<PARAMETERS>
): ExtendedTool<PARAMETERS> {
  return tool;
}

/**
 * Type guard to check if a tool is an OpenAI function tool
 * @param tool - The tool to check
 * @returns True if the tool is an OpenAI function tool
 */
export function isOpenAIFunctionTool(
  tool: RegisterFunctionCallingProps | Tool
): tool is RegisterFunctionCallingProps {
  return 'name' in tool && 'properties' in tool;
}

/**
 * Type guard to check if a tool is a Vercel function tool
 * @param tool - The tool to check
 * @returns True if the tool is a Vercel function tool
 */
export function isVercelFunctionTool(
  tool: RegisterFunctionCallingProps | ExtendedTool
): tool is ExtendedTool {
  return 'parameters' in tool && 'execute' in tool && 'description' in tool;
}

/**
 * Creates an AI assistant instance with the specified configuration
 *
 * @param props - Configuration properties for the assistant. See {@link UseAssistantProps} for more details.
 * @returns Promise that resolves to the configured assistant instance
 *
 * @example
 * ```ts
 * const assistant = await createAssistant({
 *   modelProvider: 'openai',
 *   model: 'gpt-4',
 *   apiKey: 'your-api-key',
 *   instructions: 'You are a helpful assistant',
 *   functions: [
 *     tool({
 *       description: 'Get the weather in a location',
 *       parameters: z.object({ location: z.string() }),
 *       execute: async ({ location }, option) => {
 *         const getStation = options.context?.getStation;
 *         const station = getStation ? await getStation(location) : null;
 *         return { llmResult: `Weather in ${location} from station ${station}.` };
 *       },
 *       context: {
 *         getStation: async (location) => {
 *           return { station: '123' };
 *         },
 *       },
 *       component: WeatherComponent,
 *     })
 *   ]
 * });
 */
export async function createAssistant(props: UseAssistantProps) {
  const AssistantModel = GetAssistantModelByProvider({
    provider: props.modelProvider,
    chatEndpoint: props.chatEndpoint,
  });

  // configure the assistant model
  AssistantModel.configure({
    chatEndpoint: props.chatEndpoint,
    voiceEndpoint: props.voiceEndpoint,
    model: props.model,
    apiKey: props.apiKey,
    instructions: props.instructions,
    temperature: props.temperature,
    topP: props.topP,
    description: props.description,
    version: props.version,
    toolChoice: props.toolChoice,
    maxSteps: props.maxSteps,
    toolCallStreaming: props.toolCallStreaming,
    ...(props.baseUrl ? { baseURL: props.baseUrl } : {}),
  });

  // register custom functions using OpenAI Function format
  if (Array.isArray(props.functions)) {
    props.functions.forEach((func) => {
      if (isOpenAIFunctionTool(func)) {
        AssistantModel.registerFunctionCalling({
          name: func.name,
          description: func.description,
          properties: func.properties,
          required: func.required,
          callbackFunction: func.callbackFunction,
          callbackFunctionContext: func.callbackFunctionContext,
          callbackMessage: func.callbackMessage,
        });
      }
    });
  }

  // register custom functions using Vercel Tool format
  if (props.functions) {
    Object.keys(props.functions).forEach((functionName) => {
      if (isVercelFunctionTool(props.functions![functionName])) {
        const func = props.functions![functionName];
        // get the description from the tool
        let description = '';
        if (func.type === 'function' || func.type === undefined) {
          description = func.description || '';
        }
        // convert the zod schema to a json schema
        const jsonSchemaFunctionDef = toJsonSchema({
          name: functionName,
          description,
          schema: func.parameters,
        });

        AssistantModel.registerFunctionCalling({
          name: jsonSchemaFunctionDef.name,
          description: jsonSchemaFunctionDef.description || '',
          // @ts-expect-error - TODO: fix this
          properties: jsonSchemaFunctionDef.parameters.properties || {},
          required: jsonSchemaFunctionDef.parameters.required || [],
          ...(func.execute
            ? { callbackFunction: createCallbackFunction(func.execute) }
            : {}),
          ...(func.context ? { callbackFunctionContext: func.context } : {}),
          ...(func.component ? { component: func.component } : {}),
        });
      }
    });
  }

  // initialize the assistant model
  const assistant = await AssistantModel.getInstance();

  // restore the history messages
  if (props.historyMessages && assistant.getMessages().length === 0) {
    assistant.setMessages(props.historyMessages);
  }

  // set the abort controller
  if (props.abortController) {
    assistant.setAbortController(props.abortController);
  }

  return assistant;
}

function isExecuteFunctionResult(
  result: unknown
): result is ExecuteFunctionResult {
  return typeof result === 'object' && result !== null && 'llmResult' in result;
}

function createCallbackFunction<PARAMETERS extends Parameters>(
  execute: ExecuteFunction<PARAMETERS>
) {
  const callbackFunction = async (props: CallbackFunctionProps) => {
    const { functionArgs, functionContext, functionName } = props;
    const args = functionArgs as inferParameters<PARAMETERS>;
    const context = functionContext;

    try {
      const result = await execute?.(args, { context });

      // check result type: {llmResult, outputData}
      if (!isExecuteFunctionResult(result)) {
        return {
          name: functionName,
          result: {
            success: false,
            details:
              'Failed to execute function. Executaion results are not valid.',
          },
        };
      }

      return {
        name: functionName,
        result: result.llmResult,
        data: result.additionalData,
      };
    } catch (error) {
      return {
        type: 'error',
        name: functionName,
        result: {
          success: false,
          details: `Failed to execute function. ${error}`,
        },
      };
    }
  };

  return callbackFunction;
}
