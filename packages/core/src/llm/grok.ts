import { XaiProvider, XaiProviderSettings, createXai } from '@ai-sdk/xai';

import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';

/**
 * XAi Grok Assistant LLM for Client only
 */
export class XaiAssistant extends VercelAiClient {
  protected providerInstance: XaiProvider | null = null;

  protected static instance: XaiAssistant | null = null;

  protected static checkModel() {
    if (!XaiAssistant.model || XaiAssistant.model.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  protected static checkApiKey() {
    if (!XaiAssistant.apiKey || XaiAssistant.apiKey.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  public static override configure(config: VercelAiClientConfigureProps) {
    // call parent configure
    super.configure(config);
  }

  private constructor() {
    super();

    if (XaiAssistant.apiKey) {
      // only apiKey is provided, so we can create the openai LLM instance in the client
      const options: XaiProviderSettings = {
        apiKey: XaiAssistant.apiKey,
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
