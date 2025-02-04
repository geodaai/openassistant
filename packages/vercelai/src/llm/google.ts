import {
  createOpenAI,
  OpenAIProviderSettings,
  OpenAIProvider,
} from '@ai-sdk/openai';
import { VercelAiClient } from './vercelai-client';

/**
 * Google Gemini Assistant LLM for Client only
 */
export class GoogleAIAssistant extends VercelAiClient {
  protected providerInstance: OpenAIProvider | null = null;

  protected static instance: GoogleAIAssistant | null = null;

  protected static checkModel() {
    if (!GoogleAIAssistant.model || GoogleAIAssistant.model.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  protected static checkApiKey() {
    if (!GoogleAIAssistant.apiKey || GoogleAIAssistant.apiKey.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  private constructor() {
    super();

    if (GoogleAIAssistant.apiKey) {
      // only apiKey is provided, so we can create the openai LLM instance in the client
      const options: OpenAIProviderSettings = {
        apiKey: GoogleAIAssistant.apiKey,
      };

      // Initialize openai instance
      this.providerInstance = createOpenAI(options);

      // create a language model from the provider instance
      this.llm = this.providerInstance(GoogleAIAssistant.model);
    }
  }

  public static async getInstance(): Promise<GoogleAIAssistant> {
    if (GoogleAIAssistant.instance === null) {
      GoogleAIAssistant.instance = new GoogleAIAssistant();
    }
    return GoogleAIAssistant.instance;
  }

  public override restart() {
    super.restart();
    // need to reset the instance so getInstance doesn't return the same instance
    this.providerInstance = null;
    GoogleAIAssistant.instance = null;
  }
}
