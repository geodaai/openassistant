import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';
import { LanguageModelV1 } from 'ai';

type DeepSeekProvider = (model: string) => LanguageModelV1;
interface Module {
  createDeepSeek: (options: {
    apiKey: string;
    baseURL: string;
  }) => DeepSeekProvider;
}

/**
 * DeepSeek Assistant LLM for Client only
 */
export class DeepSeekAssistant extends VercelAiClient {
  protected static baseURL = 'https://api.deepseek.com/v1';

  protected providerInstance: DeepSeekProvider | null = null;

  protected static instance: DeepSeekAssistant | null = null;

  public static getBaseURL() {
    return DeepSeekAssistant.baseURL;
  }

  public static override configure(config: VercelAiClientConfigureProps) {
    // call parent configure
    super.configure(config);
  }

  private static async loadModule(): Promise<Module> {
    try {
      return await import('@ai-sdk/deepseek');
    } catch (error) {
      throw new Error(`Failed to load @ai-sdk/deepseek: ${error}`);
    }
  }

  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    const module = await this.loadModule();
    const ds = module.createDeepSeek({
      apiKey,
      baseURL: DeepSeekAssistant.baseURL,
    });
    return await testConnection(ds(model));
  }

  private constructor(module: Module) {
    super();
    this.initializeProvider(module);
  }

  private initializeProvider(module: Module) {
    if (!DeepSeekAssistant.apiKey) {
      return;
    }

    const options = {
      apiKey: DeepSeekAssistant.apiKey,
      baseURL: DeepSeekAssistant.baseURL,
    };

    this.providerInstance = module.createDeepSeek(options);

    if (!this.providerInstance) {
      throw new Error('Failed to initialize DeepSeek');
    }

    this.llm = this.providerInstance(DeepSeekAssistant.model);
  }

  public static async getInstance(): Promise<DeepSeekAssistant> {
    if (!DeepSeekAssistant.instance) {
      const module = await this.loadModule();
      DeepSeekAssistant.instance = new DeepSeekAssistant(module);
    }

    if (!DeepSeekAssistant.instance.llm) {
      DeepSeekAssistant.instance.restart();
      throw new Error('DeepSeekAssistant is not initialized');
    }
    return DeepSeekAssistant.instance;
  }

  public override restart() {
    super.restart();
    // need to reset the instance so getInstance doesn't return the same instance
    this.providerInstance = null;
    DeepSeekAssistant.instance = null;
  }
}
