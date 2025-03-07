import {
  createAnthropic,
  AnthropicProvider,
  AnthropicProviderSettings,
} from '@ai-sdk/anthropic';
import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';

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

  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    const anthropic = createAnthropic({
      apiKey,
      headers: AnthropicAssistant.headers,
    });
    return await testConnection(anthropic(model));
  }

  private constructor() {
    super();

    if (AnthropicAssistant.apiKey) {
      // only apiKey is provided, so we can create the Anthropic LLM instance in the client
      const options: AnthropicProviderSettings = {
        apiKey: AnthropicAssistant.apiKey,
        baseURL: AnthropicAssistant.baseURL,
        headers: { 'anthropic-dangerous-direct-browser-access': 'true' },
      };

      // Initialize Anthropic instance
      this.providerInstance = createAnthropic(options);

      // create a language model from the provider instance
      this.llm = this.providerInstance(AnthropicAssistant.model);
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
