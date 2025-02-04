import {
  createOpenAI,
  OpenAIProviderSettings,
  OpenAIProvider,
} from '@ai-sdk/openai';
import { VercelAiClient } from './vercelai-client';

/**
 * OpenAI Assistant LLM for Client only
 */
export class OpenAIAssistant extends VercelAiClient {
  protected providerInstance: OpenAIProvider | null = null;

  protected static instance: OpenAIAssistant | null = null;

  protected static checkModel() {
    if (!OpenAIAssistant.model || OpenAIAssistant.model.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  protected static checkApiKey() {
    if (!OpenAIAssistant.apiKey || OpenAIAssistant.apiKey.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  private constructor() {
    super();

    if (OpenAIAssistant.apiKey) {
      // only apiKey is provided, so we can create the openai LLM instance in the client
      const options: OpenAIProviderSettings = {
        apiKey: OpenAIAssistant.apiKey,
      };

      // Initialize openai instance
      this.providerInstance = createOpenAI(options);

      // create a language model from the provider instance
      this.llm = this.providerInstance(OpenAIAssistant.model);
    }
  }

  public static async getInstance(): Promise<OpenAIAssistant> {
    if (OpenAIAssistant.instance === null) {
      OpenAIAssistant.instance = new OpenAIAssistant();
    }
    return OpenAIAssistant.instance;
  }

  public override restart() {
    super.restart();
    // need to reset the instance so getInstance doesn't return the same instance
    this.providerInstance = null;
    OpenAIAssistant.instance = null;
  }
}
