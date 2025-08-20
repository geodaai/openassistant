// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { DeepSeekAssistant } from '../llm/deepseek';
import { GoogleAIAssistant } from '../llm/google';
import { OllamaAssistant } from '../llm/ollama';
import { OpenAIAssistant } from '../llm/openai';
import { VercelAi } from '../llm/vercelai';
import { XaiAssistant } from '../llm/grok';
import { AnthropicAssistant } from '../llm/anthropic';
import { BedrockAssistant } from '../llm/bedrock';

/**
 * Returns the appropriate Assistant model based on the provider. (Internal use)
 * 
 * @example
 *  ```tsx
 * import { GetAssistantModelByProvider } from '@openassistant/core';
 *
 * const AssistantModel = GetAssistantModelByProvider({
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
 * @returns {typeof VercelAi | typeof AnthropicAssistant | typeof OpenAIAssistant | typeof GoogleAIAssistant | typeof DeepSeekAssistant | typeof XaiAssistant | typeof OllamaAssistant | typeof BedrockAssistant} The assistant model class.
 */
export function GetAssistantModelByProvider({
  provider,
  chatEndpoint,
}: {
  provider?: string;
  chatEndpoint?: string;
}):
  | typeof VercelAi
  | typeof AnthropicAssistant
  | typeof OpenAIAssistant
  | typeof GoogleAIAssistant
  | typeof DeepSeekAssistant
  | typeof XaiAssistant
  | typeof OllamaAssistant
  | typeof BedrockAssistant {
  // server-side support
  if (chatEndpoint) {
    return VercelAi;
  }
  // client-side support
  switch (provider?.toLowerCase()) {
    case 'openai':
      return OpenAIAssistant;
    case 'anthropic':
      return AnthropicAssistant;
    case 'google':
      return GoogleAIAssistant;
    case 'deepseek':
      return DeepSeekAssistant;
    case 'xai':
      return XaiAssistant;
    case 'ollama':
      return OllamaAssistant;
    case 'bedrock':
      return BedrockAssistant;
    default:
      return OpenAIAssistant;
  }
}
