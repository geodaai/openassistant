import { createOllama, OllamaProvider } from 'ollama-ai-provider';
import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';

type ConfigureProps = {
  baseURL?: string;
} & VercelAiClientConfigureProps;
/**
 * Ollama Assistant LLM for Client only
 */
export class OllamaAssistant extends VercelAiClient {
  protected static baseURL: string = 'http://127.0.0.1:11434/api';
  protected static instance: OllamaAssistant | null = null;
  protected providerInstance: OllamaProvider | null = null;

  protected static checkBaseURL() {
    if (!OllamaAssistant.baseURL || OllamaAssistant.baseURL.trim() === '') {
      throw new Error(
        'Base URL is not configured for Ollama. Please call configure() first.'
      );
    }
  }

  public static getBaseURL() {
    return OllamaAssistant.baseURL;
  }

  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    const llm = createOllama({
      baseURL: OllamaAssistant.baseURL,
    });
    return await testConnection(llm(model));
  }

  public static override configure(config: ConfigureProps) {
    // remove baseURL from config
    const { baseURL, ...rest } = config;
    // config baseURL
    if (baseURL) OllamaAssistant.baseURL = baseURL;
    // call parent configure, with config without baseURL
    super.configure(rest);
  }

  private constructor() {
    super();

    if (OllamaAssistant.model) {
      // only apiKey is provided, so we can create the openai LLM instance in the client
      const options = {
        baseURL: OllamaAssistant.baseURL,
      };

      // Initialize openai instance
      this.providerInstance = createOllama(options);

      // create a language model from the provider instance, e.g. phi3
      this.llm = this.providerInstance(OllamaAssistant.model);
    }
  }

  public static async getInstance(): Promise<OllamaAssistant> {
    if (OllamaAssistant.instance === null) {
      OllamaAssistant.instance = new OllamaAssistant();
    }
    return OllamaAssistant.instance;
  }

  public override restart() {
    super.restart();
    // need to reset the instance so getInstance doesn't return the same instance
    this.providerInstance = null;
    OllamaAssistant.instance = null;
  }
}
