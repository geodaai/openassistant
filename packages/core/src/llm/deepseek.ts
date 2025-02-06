import {
  createDeepSeek,
  DeepSeekProviderSettings,
  DeepSeekProvider,
} from '@ai-sdk/deepseek';
import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';

/**
 * DeepSeek Assistant LLM for Client only
 */
export class DeepSeekAssistant extends VercelAiClient {
  protected providerInstance: DeepSeekProvider | null = null;

  protected static instance: DeepSeekAssistant | null = null;

  protected static checkModel() {
    if (!DeepSeekAssistant.model || DeepSeekAssistant.model.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  protected static checkApiKey() {
    if (!DeepSeekAssistant.apiKey || DeepSeekAssistant.apiKey.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  public static override configure(config: VercelAiClientConfigureProps) {
    // call parent configure
    super.configure(config);
  }

  private constructor() {
    super();

    if (DeepSeekAssistant.apiKey) {
      // only apiKey is provided, so we can create the openai LLM instance in the client
      const options: DeepSeekProviderSettings = {
        apiKey: DeepSeekAssistant.apiKey,
      };

      // Initialize openai instance
      this.providerInstance = createDeepSeek(options);

      // create a language model from the provider instance
      this.llm = this.providerInstance(DeepSeekAssistant.model);
    }
  }

  public static async getInstance(): Promise<DeepSeekAssistant> {
    if (DeepSeekAssistant.instance === null) {
      DeepSeekAssistant.instance = new DeepSeekAssistant();
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
