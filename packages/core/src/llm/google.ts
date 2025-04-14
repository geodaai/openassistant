import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';
import { LanguageModelV1 } from 'ai';

type GoogleGenerativeAIProvider = (model: string) => LanguageModelV1;
interface Module {
  createGoogleGenerativeAI: (options: {
    apiKey: string;
    baseURL: string;
  }) => GoogleGenerativeAIProvider;
}

/**
 * Google Gemini Assistant LLM for Client only
 */
export class GoogleAIAssistant extends VercelAiClient {
  protected static baseURL = 'https://generativelanguage.googleapis.com/v1beta';

  protected providerInstance: GoogleGenerativeAIProvider | null = null;

  protected static instance: GoogleAIAssistant | null = null;

  public static getBaseURL() {
    return GoogleAIAssistant.baseURL;
  }

  public static override configure(config: VercelAiClientConfigureProps) {
    // call parent configure
    super.configure(config);
  }

  private static async loadModule(): Promise<Module> {
    try {
      // @ts-ignore the package will be installed by the user and loaded dynamically
      return await import('@ai-sdk/google');
    } catch (error) {
      throw new Error(`Failed to load @ai-sdk/google: ${error}`);
    }
  }

  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    const module = await this.loadModule();
    const llm = module.createGoogleGenerativeAI({
      apiKey,
      baseURL: GoogleAIAssistant.baseURL,
    });
    return await testConnection(llm(model));
  }

  private constructor(module: Module) {
    super();
    this.initializeProvider(module);
  }

  private initializeProvider(module: Module): void {
    if (!GoogleAIAssistant.apiKey) {
      return;
    }

    const options = {
      apiKey: GoogleAIAssistant.apiKey,
      baseURL: GoogleAIAssistant.baseURL,
    };

    this.providerInstance = module.createGoogleGenerativeAI(options);

    if (!this.providerInstance) {
      throw new Error('Failed to initialize Google');
    }

    this.llm = this.providerInstance(GoogleAIAssistant.model);
  }

  public static async getInstance(): Promise<GoogleAIAssistant> {
    if (!GoogleAIAssistant.instance) {
      const module = await this.loadModule();
      GoogleAIAssistant.instance = new GoogleAIAssistant(module);
    }

    if (!GoogleAIAssistant.instance.llm) {
      GoogleAIAssistant.instance.restart();
      throw new Error('GoogleAIAssistant is not initialized');
    }

    return GoogleAIAssistant.instance;
  }

  public override restart() {
    super.restart();
    // need to reset the instance so getInstance doesn't return the same instance
    this.providerInstance = null;
    GoogleAIAssistant.instance = null;
  }
}
