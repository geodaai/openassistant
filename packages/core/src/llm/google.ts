// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';
import { LanguageModel } from 'ai';

type GoogleGenerativeAIProvider = (model: string) => LanguageModel;
interface Module {
  createGoogleGenerativeAI: (options: {
    apiKey: string;
    baseURL: string;
  }) => GoogleGenerativeAIProvider;
}

const DEFAULT_GOOGLE_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta';

/**
 * Google Gemini Assistant LLM for Client only
 */
export class GoogleAIAssistant extends VercelAiClient {
  protected static baseURL = DEFAULT_GOOGLE_BASE_URL;

  protected providerInstance: GoogleGenerativeAIProvider | null = null;

  protected static instance: GoogleAIAssistant | null = null;

  public static getBaseURL() {
    return GoogleAIAssistant.baseURL;
  }

  public static override configure(config: VercelAiClientConfigureProps) {
    // Check if model has changed
    const modelChanged =
      config.model && config.model !== GoogleAIAssistant.model;
    const baseURLChanged =
      config.baseURL && config.baseURL !== GoogleAIAssistant.baseURL;

    // call parent configure
    super.configure(config);
    if (config.baseURL) GoogleAIAssistant.baseURL = config.baseURL;

    // If model or baseURL changed, reset the instance to force recreation
    if (modelChanged || baseURLChanged) {
      if (GoogleAIAssistant.instance) {
        GoogleAIAssistant.instance.restart();
      }
    }
  }

  private static async loadModule(): Promise<Module> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    if (
      GoogleAIAssistant.apiKey ||
      GoogleAIAssistant.baseURL !== DEFAULT_GOOGLE_BASE_URL
    ) {
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
