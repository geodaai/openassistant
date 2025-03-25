import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';
import { LanguageModelV1 } from 'ai';

type OllamaProvider = (model: string) => LanguageModelV1;

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
    try {
      const { createOllama } = await import('ollama-ai-provider');
      const llm = createOllama({
        baseURL: OllamaAssistant.baseURL,
      });
      return await testConnection(llm(model));
    } catch (error) {
      console.error('Failed to load ollama-ai-provider:', error);
      return false;
    }
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
      this.initializeOllama();
    }
  }

  private async initializeOllama() {
    try {
      const { createOllama } = await import('ollama-ai-provider');
      // only apiKey is provided, so we can create the LLM instance in the client
      const options = {
        baseURL: OllamaAssistant.baseURL,
      };

      // Initialize openai instance
      this.providerInstance = createOllama(options);

      // create a language model from the provider instance, e.g. phi3
      this.llm = this.providerInstance(OllamaAssistant.model);
    } catch (error) {
      throw new Error(`Failed to initialize Ollama. ${error}`);
    }
  }

  public static async getInstance(): Promise<OllamaAssistant> {
    if (OllamaAssistant.instance === null) {
      OllamaAssistant.instance = new OllamaAssistant();
    }
    if (OllamaAssistant.instance.llm === null) {
      // reset the instance so getInstance doesn't return the same instance
      OllamaAssistant.instance.restart();
      throw new Error('OllamaAssistant is not initialized');
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
