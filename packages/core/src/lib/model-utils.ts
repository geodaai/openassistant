import { DeepSeekAssistant } from '../llm/deepseek';
import { GoogleAIAssistant } from '../llm/google';
import { OllamaAssistant } from '../llm/ollama';
import { OpenAIAssistant } from '../llm/openai';
import { VercelAi } from '../llm/vercelai';
import { XaiAssistant } from '../llm/grok';
import { AnthropicAssistant } from '../llm/anthropic';

/**
 * Returns the appropriate Assistant model based on the provider.
 *
 * @param {Object} options - The options object
 * @param {string} [options.provider] - The name of the AI provider. If not provided, defaults to OpenAI.
 * @param {string} [options.chatEndpoint] - The chat endpoint that handles the chat requests, e.g. '/api/chat'. This is required for server-side support.
 * @returns {typeof VercelAi | typeof AnthropicAssistant | typeof OpenAIAssistant | typeof GoogleAIAssistant | typeof DeepSeekAssistant | typeof XaiAssistant | typeof OllamaAssistant} The assistant model class.
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
  | typeof OllamaAssistant {
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
    default:
      return OpenAIAssistant;
  }
}
