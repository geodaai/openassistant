import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';
import { LanguageModelV1 } from 'ai';

type DeepSeekProvider = (model: string) => LanguageModelV1;

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
    try {
      const { createDeepSeek } = await import('@ai-sdk/deepseek');
      const ds = createDeepSeek({ apiKey });
      return await testConnection(ds(model));
    } catch (error) {
      console.error('Failed to load @ai-sdk/deepseek:', error);
      return false;
    }
  }

  private constructor() {
    super();

    if (DeepSeekAssistant.apiKey) {
      this.initializeDeepSeek();
    }
  }

  private async initializeDeepSeek() {
    try {
      const { createDeepSeek } = await import('@ai-sdk/deepseek');
      const options = {
        apiKey: DeepSeekAssistant.apiKey,
        baseURL: DeepSeekAssistant.baseURL,
      };

      this.providerInstance = createDeepSeek(options);

      this.llm = this.providerInstance(DeepSeekAssistant.model);
    } catch (error) {
      throw new Error(`Failed to initialize DeepSeek. ${error}`);
    }
  }

  public static async getInstance(): Promise<DeepSeekAssistant> {
    if (DeepSeekAssistant.instance === null) {
      DeepSeekAssistant.instance = new DeepSeekAssistant();
    }
    if (DeepSeekAssistant.instance.llm === null) {
      // reset the instance so getInstance doesn't return the same instance
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
