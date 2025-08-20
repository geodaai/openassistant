// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { VercelAi } from '../llm/vercelai';
import { VercelAiClientConfigureProps } from '../llm/vercelai-client';

// Interface for Assistant classes with common methods
// Using any for getInstance return type to accommodate different assistant implementations
export interface AssistantClass {
  configure(config: VercelAiClientConfigureProps & { chatEndpoint?: string; voiceEndpoint?: string }): void;
  getInstance(): Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  registerTool(props: {
    name: string;
    tool: unknown;
    component?: unknown;
  }): void;
  addToolResult?(toolCallId: string, additionalData: unknown): void;
  testConnection?(apiKey: string, model: string): Promise<boolean>;
  getBaseURL?(): string | void;
}

/**
 * Returns the appropriate Assistant model based on the provider. (Internal use)
 * 
 * @example
 *  ```tsx
 * import { GetAssistantModelByProvider } from '@openassistant/core';
 *
 * const AssistantModel = await GetAssistantModelByProvider({
 *   provider: 'openai',
 * });
 *
 * // configure the assistant model
 * AssistantModel.configure({
 *   apiKey: 'your-api-key',
 *   model: 'gpt-4o',
 * });
 *
 * // initialize the assistant model
 * const assistant = await AssistantModel.getInstance();
 *
 * // send a message to the assistant
 * const result = await assistant.processTextMessage({
 *   text: 'Hello, world!',
 * });
 * ```
 *
 * @param {Object} options - The options object
 * @param {string} [options.provider] - The name of the AI provider. The supported providers are: 'openai', 'anthropic', 'google', 'deepseek', 'xai', 'ollama', 'bedrock'
 * @param {string} [options.chatEndpoint] - The chat endpoint that handles the chat requests, e.g. '/api/chat'. This is required for server-side support.
 * @returns {Promise<AssistantClass>} Promise that resolves to the assistant model class.
 */
export async function GetAssistantModelByProvider({
  provider,
  chatEndpoint,
}: {
  provider?: string;
  chatEndpoint?: string;
}): Promise<AssistantClass> {
  // server-side support
  if (chatEndpoint) {
    return VercelAi as unknown as AssistantClass;
  }
  
  // client-side support with dynamic imports
  try {
    switch (provider?.toLowerCase()) {
      case 'openai':
        return (await import('../llm/openai')).OpenAIAssistant as unknown as AssistantClass;
      case 'anthropic':
        return (await import('../llm/anthropic')).AnthropicAssistant as unknown as AssistantClass;
      case 'google':
        return (await import('../llm/google')).GoogleAIAssistant as unknown as AssistantClass;
      case 'deepseek':
        return (await import('../llm/deepseek')).DeepSeekAssistant as unknown as AssistantClass;
      case 'xai':
        return (await import('../llm/grok')).XaiAssistant as unknown as AssistantClass;
      case 'ollama':
        return (await import('../llm/ollama')).OllamaAssistant as unknown as AssistantClass;
      case 'bedrock':
        return (await import('../llm/bedrock')).BedrockAssistant as unknown as AssistantClass;
      default:
        return (await import('../llm/openai')).OpenAIAssistant as unknown as AssistantClass;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to load provider '${provider}': ${errorMessage}. ` +
      `Make sure the required provider package is installed. ` +
      `For example, for '${provider}' provider, install the corresponding @ai-sdk package.`
    );
  }
}
