import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';
import { LanguageModelV1 } from 'ai';

type GoogleGenerativeAIProvider = (model: string) => LanguageModelV1;

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
    try {
      const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
      const llm = createGoogleGenerativeAI({ apiKey });
      return await testConnection(llm(model));
    } catch (error) {
      console.error('Failed to load @ai-sdk/google:', error);
      return false;
    }
  }

  private constructor() {
    super();

    if (GoogleAIAssistant.apiKey) {
      this.initializeGoogle();
    }
  }

  private async initializeGoogle() {
    try {
      const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
      // only apiKey is provided, so we can create the LLM instance in the client
      const options = {
        apiKey: GoogleAIAssistant.apiKey,
        baseURL: GoogleAIAssistant.baseURL,
      };

      // Initialize provider instance
      this.providerInstance = createGoogleGenerativeAI(options);

      // create a language model from the provider instance
      this.llm = this.providerInstance(GoogleAIAssistant.model);
    } catch (error) {
      throw new Error(`Failed to initialize Google. ${error}`);
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
