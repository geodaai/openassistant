import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';
import { LanguageModelV1 } from 'ai';

type XaiProvider = (model: string) => LanguageModelV1;

/**
 * XAi Grok Assistant LLM for Client only
 */
export class XaiAssistant extends VercelAiClient {
  protected static baseURL = 'https://api.grok.com/v1';

  protected providerInstance: XaiProvider | null = null;

  protected static instance: XaiAssistant | null = null;

  public static getBaseURL() {
    return XaiAssistant.baseURL;
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
      const { createXai } = await import('@ai-sdk/xai');
      const llm = createXai({ apiKey });
      return await testConnection(llm(model));
    } catch (error) {
      console.error('Failed to load @ai-sdk/xai:', error);
      return false;
    }
  }

  private constructor() {
    super();

    if (XaiAssistant.apiKey) {
      this.initializeXai();
    }
  }

  private async initializeXai() {
    try {
      const { createXai } = await import('@ai-sdk/xai');
      // only apiKey is provided, so we can create the openai LLM instance in the client
      const options = {
        apiKey: XaiAssistant.apiKey,
        baseURL: XaiAssistant.baseURL,
      };

      // Initialize openai instance
      this.providerInstance = createXai(options);

      // create a language model from the provider instance
      this.llm = this.providerInstance(XaiAssistant.model);
    } catch (error) {
      throw new Error(`Failed to initialize Xai. ${error}`);
    }
  }

  public static async getInstance(): Promise<XaiAssistant> {
    if (XaiAssistant.instance === null) {
      XaiAssistant.instance = new XaiAssistant();
    }
    if (XaiAssistant.instance.llm === null) {
      // reset the instance so getInstance doesn't return the same instance
      XaiAssistant.instance.restart();
      throw new Error('XaiAssistant is not initialized');
    }
    return XaiAssistant.instance;
  }

  public override restart() {
    super.restart();
    // need to reset the instance so getInstance doesn't return the same instance
    this.providerInstance = null;
    XaiAssistant.instance = null;
  }
}
