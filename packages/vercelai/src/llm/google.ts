import {
  GoogleGenerativeAIProvider,
  GoogleGenerativeAIProviderSettings,
  createGoogleGenerativeAI,
} from '@ai-sdk/google';

import { VercelAiClient } from './vercelai-client';
import { AudioToTextProps } from 'src/types';
import { generateText } from 'ai';

/**
 * Google Gemini Assistant LLM for Client only
 */
export class GoogleAIAssistant extends VercelAiClient {
  protected providerInstance: GoogleGenerativeAIProvider | null = null;

  protected static instance: GoogleAIAssistant | null = null;

  protected static checkModel() {
    if (!GoogleAIAssistant.model || GoogleAIAssistant.model.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  protected static checkApiKey() {
    if (!GoogleAIAssistant.apiKey || GoogleAIAssistant.apiKey.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  private constructor() {
    super();

    if (GoogleAIAssistant.apiKey) {
      // only apiKey is provided, so we can create the openai LLM instance in the client
      const options: GoogleGenerativeAIProviderSettings = {
        apiKey: GoogleAIAssistant.apiKey,
      };

      // Initialize openai instance
      this.providerInstance = createGoogleGenerativeAI(options);

      // create a language model from the provider instance
      this.llm = this.providerInstance(GoogleAIAssistant.model);
    }
  }

  public static async getInstance(): Promise<GoogleAIAssistant> {
    if (GoogleAIAssistant.instance === null) {
      GoogleAIAssistant.instance = new GoogleAIAssistant();
    }
    return GoogleAIAssistant.instance;
  }

  public override restart() {
    super.restart();
    // need to reset the instance so getInstance doesn't return the same instance
    this.providerInstance = null;
    GoogleAIAssistant.instance = null;
  }

  public override async audioToText({
    audioBlob,
  }: AudioToTextProps): Promise<string> {
    if (!this.llm) {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
    if (!audioBlob) {
      throw new Error('audioBlob is null');
    }
    if (!this.abortController) {
      this.abortController = new AbortController();
    }

    const file = new File([audioBlob], 'audio.webm');

    const response = await generateText({
      model: this.llm,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Translating audio to text, and return plain text based on the following schema: {text: content}',
            },
            {
              type: 'file',
              data: file,
              mimeType: 'audio/webm',
            },
          ],
        },
      ],
    });

    return response.text;
  }
}
