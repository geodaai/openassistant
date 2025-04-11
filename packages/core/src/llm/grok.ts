import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';
import { LanguageModelV1 } from 'ai';

type XaiProvider = (model: string) => LanguageModelV1;
interface Module {
  createXai: (options: { apiKey: string; baseURL: string }) => XaiProvider;
}

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

  private static async loadModule(): Promise<Module> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error the package will be installed by the user and loaded dynamically
      return await import('@ai-sdk/xai');
    } catch (error) {
      throw new Error(`Failed to load @ai-sdk/xai: ${error}`);
    }
  }

  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    const module = await this.loadModule();
    const llm = module.createXai({ apiKey, baseURL: XaiAssistant.baseURL });
    return await testConnection(llm(model));
  }

  private constructor(module: Module) {
    super();
    this.initializeProvider(module);
  }

  private initializeProvider(module: Module) {
    if (!XaiAssistant.apiKey) {
      return;
    }

    const options = {
      apiKey: XaiAssistant.apiKey,
      baseURL: XaiAssistant.baseURL,
    };

    this.providerInstance = module.createXai(options);

    if (!this.providerInstance) {
      throw new Error('Failed to initialize Xai');
    }

    this.llm = this.providerInstance(XaiAssistant.model);
  }

  public static async getInstance(): Promise<XaiAssistant> {
    if (!XaiAssistant.instance) {
      const module = await this.loadModule();
      XaiAssistant.instance = new XaiAssistant(module);
    }

    if (!XaiAssistant.instance.llm) {
      XaiAssistant.instance.restart();
      throw new Error('XaiAssistant is not initialized');
    }
    return XaiAssistant.instance;
  }

  public override restart() {
    super.restart();
    this.providerInstance = null;
    XaiAssistant.instance = null;
  }
}
