// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { testConnection } from '../utils/connection-test';
import { LanguageModelV1 } from 'ai';

type BedrockProvider = (model: string) => LanguageModelV1;
interface Module {
  createBedrock: (options: {
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  }) => BedrockProvider;
}

const DEFAULT_BEDROCK_REGION = 'us-east-1';
const DEFAULT_BEDROCK_BASE_URL = 'https://bedrock.us-east-1.amazonaws.com';

/**
 * AWS Bedrock Assistant LLM for Client only
 */
export class BedrockAssistant extends VercelAiClient {
  protected static region = DEFAULT_BEDROCK_REGION;

  protected static baseURL = DEFAULT_BEDROCK_BASE_URL;

  protected providerInstance: BedrockProvider | null = null;

  protected static instance: BedrockAssistant | null = null;

  public static getRegion() {
    return BedrockAssistant.region;
  }

  public static override configure(
    config: VercelAiClientConfigureProps & { region?: string }
  ) {
    // Check if model has changed
    const modelChanged =
      config.model && config.model !== BedrockAssistant.model;
    const baseURLChanged =
      config.baseURL && config.baseURL !== BedrockAssistant.baseURL;

    // call parent configure
    super.configure(config);
    if (config.region) BedrockAssistant.region = config.region;
    if (config.baseURL) BedrockAssistant.baseURL = config.baseURL;

    // If model or baseURL changed, reset the instance to force recreation
    if (modelChanged || baseURLChanged) {
      if (BedrockAssistant.instance) {
        BedrockAssistant.instance.restart();
      }
    }
  }

  private static async loadModule(): Promise<Module> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore the package will be installed by the user and loaded dynamically
      return await import('@ai-sdk/amazon-bedrock');
    } catch (error) {
      throw new Error(`Failed to load @ai-sdk/amazon-bedrock: ${error}`);
    }
  }

  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    const module = await this.loadModule();
    // For Bedrock, apiKey is expected to be in format "accessKeyId:secretAccessKey"
    const credentials = apiKey.split(':');
    const accessKeyId = credentials[0] || '';
    const secretAccessKey = credentials[1] || '';

    const bedrock = module.createBedrock({
      region: BedrockAssistant.region,
      ...(accessKeyId && { accessKeyId }),
      ...(secretAccessKey && { secretAccessKey }),
    });
    return await testConnection(bedrock(model));
  }

  private constructor(module: Module) {
    super();
    this.initializeProvider(module);
  }

  private initializeProvider(module: Module) {
    if (
      BedrockAssistant.apiKey ||
      BedrockAssistant.baseURL !== DEFAULT_BEDROCK_BASE_URL
    ) {
      // For Bedrock, apiKey is treated as accessKeyId and we need to parse secretAccessKey
      // This is a simplified approach - in practice, you might want to handle credentials differently
      const credentials = BedrockAssistant.apiKey.split(':');
      const accessKeyId = credentials[0] || '';
      const secretAccessKey = credentials[1] || '';

      const options = {
        region: BedrockAssistant.region,
        ...(accessKeyId && { accessKeyId }),
        ...(secretAccessKey && { secretAccessKey }),
      };

      this.providerInstance = module.createBedrock(options);

      if (!this.providerInstance) {
        throw new Error('Failed to initialize Bedrock');
      }

      this.llm = this.providerInstance(BedrockAssistant.model);
    }
  }

  public static async getInstance(): Promise<BedrockAssistant> {
    if (!BedrockAssistant.instance) {
      const module = await this.loadModule();
      BedrockAssistant.instance = new BedrockAssistant(module);
    }

    if (!BedrockAssistant.instance.llm) {
      BedrockAssistant.instance.restart();
      throw new Error('BedrockAssistant is not initialized');
    }
    return BedrockAssistant.instance;
  }

  public override restart() {
    super.restart();
    // need to reset the instance so getInstance doesn't return the same instance
    this.providerInstance = null;
    BedrockAssistant.instance = null;
  }
}
