import { XaiProvider, XaiProviderSettings, createXai } from '@ai-sdk/xai';

import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';

/**
 * XAi Grok Assistant LLM for Client only
 */
export class XaiAssistant extends VercelAiClient {
  protected static baseURL = 'https://api.grok.com/v1';
  protected providerInstance: XaiProvider | null = null;

  protected static instance: XaiAssistant | null = null;

  public static override configure(config: VercelAiClientConfigureProps) {
    // call parent configure
    super.configure(config);
  }

  public static async testConnection(apiKey: string, model: string): Promise<boolean> {
    const llm = createXai({ apiKey });
    return await testConnection(llm(model));
  }

  private constructor() {
    super();

    if (XaiAssistant.apiKey) {
      // only apiKey is provided, so we can create the openai LLM instance in the client
      const options: XaiProviderSettings = {
        apiKey: XaiAssistant.apiKey,
        baseURL: XaiAssistant.baseURL,
      };

      // Initialize openai instance
      this.providerInstance = createXai(options);

      // create a language model from the provider instance
      this.llm = this.providerInstance(XaiAssistant.model);
    }
  }

  public static async getInstance(): Promise<XaiAssistant> {
    if (XaiAssistant.instance === null) {
      XaiAssistant.instance = new XaiAssistant();
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
