// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { VercelAi } from '../llm/vercelai';

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
 * @returns {Promise<typeof VercelAi | unknown>} Promise that resolves to the assistant model class.
 */
export async function GetAssistantModelByProvider({
  provider,
  chatEndpoint,
}: {
  provider?: string;
  chatEndpoint?: string;
}): Promise<typeof VercelAi | unknown> {
  // server-side support
  if (chatEndpoint) {
    return VercelAi;
  }
  
  // client-side support with dynamic imports
  try {
    switch (provider?.toLowerCase()) {
      case 'openai':
        return (await import('../llm/openai')).OpenAIAssistant;
      case 'anthropic':
        return (await import('../llm/anthropic')).AnthropicAssistant;
      case 'google':
        return (await import('../llm/google')).GoogleAIAssistant;
      case 'deepseek':
        return (await import('../llm/deepseek')).DeepSeekAssistant;
      case 'xai':
        return (await import('../llm/grok')).XaiAssistant;
      case 'ollama':
        return (await import('../llm/ollama')).OllamaAssistant;
      case 'bedrock':
        return (await import('../llm/bedrock')).BedrockAssistant;
      default:
        return (await import('../llm/openai')).OpenAIAssistant;
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
