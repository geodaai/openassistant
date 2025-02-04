import { createOllama, OllamaProvider } from 'ollama-ai-provider';
import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';

type ConfigureProps = {
  baseURL?: string;
} & VercelAiClientConfigureProps;
/**
 * Ollama Assistant LLM for Client only
 */
export class OllamaAssistant extends VercelAiClient {
  protected providerInstance: OllamaProvider | null = null;

  protected static instance: OllamaAssistant | null = null;

  protected static baseURL: string = 'http://127.0.0.1:11434';

  protected static checkModel() {
    if (!OllamaAssistant.model || OllamaAssistant.model.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  protected static checkApiKey() {
    if (!OllamaAssistant.baseURL || OllamaAssistant.baseURL.trim() === '') {
      throw new Error(
        'Base URL is not configured for Ollama. Please call configure() first.'
      );
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
