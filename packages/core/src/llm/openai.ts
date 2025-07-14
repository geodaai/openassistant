// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  createOpenAI,
  OpenAIProviderSettings,
  OpenAIProvider,
} from '@ai-sdk/openai';
import { OpenAI } from 'openai';
import {
  VercelAiClient,
  VercelAiClientConfigureProps,
} from './vercelai-client';
import { AudioToTextProps } from '../types';
import { testConnection } from '../utils/connection-test';

const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';

/**
 * OpenAI Assistant LLM for Client only
 */
export class OpenAIAssistant extends VercelAiClient {
  protected static baseURL = DEFAULT_OPENAI_BASE_URL;

  protected providerInstance: OpenAIProvider | null = null;

  protected static instance: OpenAIAssistant | null = null;

  protected openaiClient: OpenAI | null = null;

  public static getBaseURL() {
    return OpenAIAssistant.baseURL;
  }

  public static override configure(config: VercelAiClientConfigureProps) {
    // call parent configure
    super.configure(config);
  }

  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    const oai = createOpenAI({
      apiKey,
      baseURL: OpenAIAssistant.baseURL,
      compatibility:
        OpenAIAssistant.baseURL === DEFAULT_OPENAI_BASE_URL
          ? 'strict'
          : 'compatible',
    });
    return await testConnection(oai(model));
  }

  private constructor() {
    super();

    if (OpenAIAssistant.apiKey) {
      // only apiKey is provided, so we can create the openai LLM instance in the client
      const options: OpenAIProviderSettings = {
        apiKey: OpenAIAssistant.apiKey,
        baseURL: OpenAIAssistant.baseURL,
        compatibility: 'strict', // strict mode, enable when using the OpenAI API
      };

      // Initialize openai instance
      this.providerInstance = createOpenAI(options);

      // create a language model from the provider instance
      this.llm = this.providerInstance(OpenAIAssistant.model, {
        structuredOutputs: false,
        downloadImages: true
      });

      // create a openai client instance for whisper transcription
      this.openaiClient = new OpenAI({
        apiKey: OpenAIAssistant.apiKey,
        baseURL: OpenAIAssistant.baseURL,
        dangerouslyAllowBrowser: true,
      });
    }
  }

  public static async getInstance(): Promise<OpenAIAssistant> {
    if (OpenAIAssistant.instance === null) {
      OpenAIAssistant.instance = new OpenAIAssistant();
    }
    if (OpenAIAssistant.instance.llm === null) {
      // reset the instance so getInstance doesn't return the same instance
      OpenAIAssistant.instance.restart();
      throw new Error('OpenAIAssistant is not initialized');
    }
    return OpenAIAssistant.instance;
  }

  public override restart() {
    super.restart();
    // need to reset the instance so getInstance doesn't return the same instance
    this.providerInstance = null;
    this.openaiClient = null;
    OpenAIAssistant.instance = null;
  }

  /**
   * Override the audioToText method to use OpenAI Whisper
   * @param audioBlob - The audio blob to transcribe
   * @returns The transcribed text
   */
  public override async audioToText({
    audioBlob,
  }: AudioToTextProps): Promise<string> {
    if (this.openaiClient === null) {
      throw new Error('OpenAIClient is not initialized');
    }
    if (!audioBlob) {
      throw new Error('audioBlob is null');
    }
    if (!this.abortController) {
      this.abortController = new AbortController();
    }

    const file = new File([audioBlob], 'audio.webm');

    const response = await this.openaiClient.audio.transcriptions.create(
      {
        file,
        model: 'whisper-1',
      },
      {
        signal: this.abortController.signal,
      }
    );

    return response.text;
  }
}
