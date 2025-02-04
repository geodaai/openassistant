import { DeepSeekAssistant } from '../llm/deepseek';
import { GoogleAIAssistant } from '../llm/google';
import { OllamaAssistant } from '../llm/ollama';
import { OpenAIAssistant } from '../llm/openai';
import { VercelAi } from '../llm/vercelai';
import { XaiAssistant } from '../llm/grok';

/**
 * Returns the appropriate Assistant model based on the provider.
 *
 * @param {string} provider - The name of the AI provider. If not provided, the default is VercelAI which is for server-side support.
 * @param {string} chatEndpoint - The chat endpoint that handles the chat requests, e.g. '/api/chat'. This is required for server-side support. If not provided, the chat will be handled by the client.
 * @returns {typeof VercelAi | typeof OpenAIAssistant} The assistant model class.
 */
export function GetAssistantModelByProvider({
  provider,
  chatEndpoint,
}: {
  provider?: string;
  chatEndpoint?: string;
}):
  | typeof VercelAi
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
