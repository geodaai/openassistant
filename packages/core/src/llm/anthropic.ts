import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';
import { LanguageModelV1 } from 'ai';

type AnthropicProvider = (model: string) => LanguageModelV1;
interface Module {
  createAnthropic: (options: {
    apiKey: string;
    baseURL: string;
    headers: Record<string, string>;
  }) => AnthropicProvider;
}

/**
 * Anthropic Assistant LLM for Client only
 */
export class AnthropicAssistant extends VercelAiClient {
  protected static baseURL = 'https://api.anthropic.com/v1';

  // https://github.com/vercel/ai/issues/3041
  protected static headers = {
    'anthropic-dangerous-direct-browser-access': 'true',
  };

  protected providerInstance: AnthropicProvider | null = null;

  protected static instance: AnthropicAssistant | null = null;

  public static getBaseURL() {
    return AnthropicAssistant.baseURL;
  }

  public static override configure(config: VercelAiClientConfigureProps) {
    // call parent configure
    super.configure(config);
  }

  private static async loadModule(): Promise<Module> {
    try {
      // @ts-ignore dynamic import will be installed by the user
      return await import('@ai-sdk/anthropic');
    } catch (error) {
      throw new Error(`Failed to load @ai-sdk/anthropic: ${error}`);
    }
  }

  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    const module = await this.loadModule();
    const anthropic = module.createAnthropic({
      apiKey,
      baseURL: AnthropicAssistant.baseURL,
      headers: AnthropicAssistant.headers,
    });
    return await testConnection(anthropic(model));
  }

  private constructor(module: Module) {
    super();
    this.initializeProvider(module);
  }

  private initializeProvider(module: Module) {
    if (!AnthropicAssistant.apiKey) {
      return;
    }

    const options = {
      apiKey: AnthropicAssistant.apiKey,
      baseURL: AnthropicAssistant.baseURL,
      headers: AnthropicAssistant.headers,
    };

    this.providerInstance = module.createAnthropic(options);

    if (!this.providerInstance) {
      throw new Error('Failed to initialize Anthropic');
    }

    this.llm = this.providerInstance(AnthropicAssistant.model);
  }

  public static async getInstance(): Promise<AnthropicAssistant> {
    if (!AnthropicAssistant.instance) {
      const module = await this.loadModule();
      AnthropicAssistant.instance = new AnthropicAssistant(module);
    }

    if (!AnthropicAssistant.instance.llm) {
      AnthropicAssistant.instance.restart();
      throw new Error('AnthropicAssistant is not initialized');
    }

    return AnthropicAssistant.instance;
  }

  public override restart() {
    super.restart();
    // need to reset the instance so getInstance doesn't return the same instance
    this.providerInstance = null;
    AnthropicAssistant.instance = null;
  }
}
