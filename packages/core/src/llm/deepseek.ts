import {
  createDeepSeek,
  DeepSeekProviderSettings,
  DeepSeekProvider,
} from '@ai-sdk/deepseek';
import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';

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

  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    const ds = createDeepSeek({ apiKey });
    return await testConnection(ds(model));
  }

  private constructor() {
    super();

    if (DeepSeekAssistant.apiKey) {
      // only apiKey is provided, so we can create the openai LLM instance in the client
      const options: DeepSeekProviderSettings = {
        apiKey: DeepSeekAssistant.apiKey,
        baseURL: DeepSeekAssistant.baseURL,
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
