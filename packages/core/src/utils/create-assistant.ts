import { toJsonSchema } from 'openai-zod-functions';

import { GetAssistantModelByProvider } from '../lib/model-utils';
import { UseAssistantProps } from '../hooks/use-assistant';
import {
  VercelFunctionTool,
  OpenAIFunctionTool,
  RegisterFunctionCallingProps,
} from '../types';

/**
 * Type guard to check if a tool is an OpenAI function tool
 * @param tool - The tool to check
 * @returns True if the tool is an OpenAI function tool
 */
export function isOpenAIFunctionTool(
  tool: OpenAIFunctionTool | VercelFunctionTool
): tool is OpenAIFunctionTool {
  return 'name' in tool && 'properties' in tool;
}

/**
 * Type guard to check if a tool is a Vercel function tool
 * @param tool - The tool to check
 * @returns True if the tool is a Vercel function tool
 */
export function isVercelFunctionTool(
  tool: OpenAIFunctionTool | VercelFunctionTool
): tool is VercelFunctionTool {
  return 'parameters' in tool;
}

/**
 * Creates an AI assistant instance with the specified configuration
 * 
 * @param props - Configuration properties for the assistant
 * @returns Promise that resolves to the configured assistant instance
 * 
 * @example
 * ```ts
 * const assistant = await createAssistant({
 *   modelProvider: 'openai',
 *   model: 'gpt-4',
 *   apiKey: 'your-api-key',
 *   instructions: 'You are a helpful assistant'
 * });
 * ```
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

  // register custom functions using Vercel Function format
  if (props.vercelFunctions) {
    Object.keys(props.vercelFunctions).forEach((functionName) => {
      if (isVercelFunctionTool(props.vercelFunctions![functionName])) {
        const func = props.vercelFunctions![functionName];
        const jsonSchemaFunctionDef = toJsonSchema({
          name: functionName,
          description: func.description,
          schema: func.parameters,
        });
        AssistantModel.registerFunctionCalling({
          name: jsonSchemaFunctionDef.name,
          description: jsonSchemaFunctionDef.description || '',
          properties: jsonSchemaFunctionDef.parameters.properties || {},
          required: jsonSchemaFunctionDef.parameters.required || [],
          callbackFunction: func.executeWithContext,
          callbackFunctionContext: func.context,
          callbackMessage: func.message,
        } as RegisterFunctionCallingProps);
      }
    });
  }

  // initialize the assistant model
  const assistant = await AssistantModel.getInstance();

  if (props.abortController) {
    assistant.setAbortController(props.abortController);
  }

  return assistant;
}
