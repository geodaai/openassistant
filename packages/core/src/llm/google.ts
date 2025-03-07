import {
  GoogleGenerativeAIProvider,
  GoogleGenerativeAIProviderSettings,
  createGoogleGenerativeAI,
} from '@ai-sdk/google';

import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';

/**
 * Google Gemini Assistant LLM for Client only
 */
export class GoogleAIAssistant extends VercelAiClient {
  protected static baseURL = 'https://generativelanguage.googleapis.com/v1beta';

  protected providerInstance: GoogleGenerativeAIProvider | null = null;

  protected static instance: GoogleAIAssistant | null = null;

  public static getBaseURL() {
    return GoogleAIAssistant.baseURL;
  }

  public static override configure(config: VercelAiClientConfigureProps) {
    // call parent configure
    super.configure(config);
  }

  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    const llm = createGoogleGenerativeAI({ apiKey });
    return await testConnection(llm(model));
  }

  private constructor() {
    super();

    if (GoogleAIAssistant.apiKey) {
      // only apiKey is provided, so we can create the openai LLM instance in the client
      const options: GoogleGenerativeAIProviderSettings = {
        apiKey: GoogleAIAssistant.apiKey,
        baseURL: GoogleAIAssistant.baseURL,
      };

      // Initialize openai instance
      this.providerInstance = createGoogleGenerativeAI(options);

      // create a language model from the provider instance
      this.llm = this.providerInstance(GoogleAIAssistant.model);
    }
  }

  public static async getInstance(): Promise<GoogleAIAssistant> {
    if (GoogleAIAssistant.instance === null) {
      GoogleAIAssistant.instance = new GoogleAIAssistant();
    }
    if (GoogleAIAssistant.instance.llm === null) {
      // reset the instance so getInstance doesn't return the same instance
      GoogleAIAssistant.instance.restart();
      throw new Error('GoogleAIAssistant is not initialized');
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
