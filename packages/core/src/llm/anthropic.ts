import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';
import { LanguageModelV1 } from 'ai';

type AnthropicProvider = (model: string) => LanguageModelV1;

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
    super.configure(config);
  }

  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    try {
      // @ts-expect-error - @ai-sdk/anthropic will be installed by the user
      const { createAnthropic } = await import('@ai-sdk/anthropic');
      const anthropic = createAnthropic({
        apiKey,
        headers: AnthropicAssistant.headers,
      });
      return await testConnection(anthropic(model));
    } catch (error) {
      console.error('Failed to load @ai-sdk/anthropic:', error);
      return false;
    }
  }

  private constructor() {
    super();

    if (AnthropicAssistant.apiKey) {
      this.initializeAnthropic();
    }
  }

  private async initializeAnthropic() {
    try {
      // @ts-expect-error - @ai-sdk/anthropic will be installed by the user
      const { createAnthropic } = await import('@ai-sdk/anthropic');
      const options = {
        apiKey: AnthropicAssistant.apiKey,
        baseURL: AnthropicAssistant.baseURL,
        headers: { 'anthropic-dangerous-direct-browser-access': 'true' },
      };

      this.providerInstance = createAnthropic(options);
      if (!this.providerInstance) {
        throw new Error('Failed to create Anthropic provider');
      }
      this.llm = this.providerInstance(AnthropicAssistant.model);
    } catch (error) {
      throw new Error(`Failed to initialize Anthropic. ${error}`);
    }
  }

  public static async getInstance(): Promise<AnthropicAssistant> {
    if (AnthropicAssistant.instance === null) {
      AnthropicAssistant.instance = new AnthropicAssistant();
    }
    if (AnthropicAssistant.instance.llm === null) {
      // reset the instance so getInstance doesn't return the same instance
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
