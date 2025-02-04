import { OpenAI } from 'openai';
import { Buffer } from 'buffer';
import { GetAssistantModelByProvider } from './model-utils';
import { generateText } from 'ai';
import { VercelAiClient } from '../llm/vercelai-client';

/**
 * Handles voice transcription requests using OpenAI Whisper
 */
export class WhisperVoiceHandler {
  private client: OpenAI;

  /**
   * @param {Object} config - Configuration object
   * @param {string} config.apiKey - OpenAI API key
   */
  constructor({ apiKey }: { apiKey: string }) {
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Processes voice transcription requests
   * @param {Request} req - Incoming request object containing base64 audio data
   * @returns {Promise<Response>} Streaming response with transcription
   */
  async processRequest(req: Request): Promise<Response> {
    try {
      const formData = await req.formData();
      const audioFile = formData.get('file');

      if (!audioFile || !(audioFile instanceof File)) {
        return new Response(
          JSON.stringify({ error: 'No audio file provided' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const response = await this.client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en',
      });

      return new Response(JSON.stringify({ transcript: response.text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}

/**
 * Handles voice transcription requests using Google Gemini
 */
export class VoiceHandler {
  private model: VercelAiClient | null = null;

  constructor({
    provider,
    apiKey,
    model,
  }: {
    provider: string;
    apiKey: string;
    model: string;
  }) {
    const AssistantModel = GetAssistantModelByProvider({
      provider,
    });

    AssistantModel.configure({
      apiKey,
      model,
      temperature: 0,
    });

    this.model = null; // Initialize as null
    this.initialize(AssistantModel); // Call initialize without await
  }

  private async initialize(AssistantModel) {
    this.model = await AssistantModel.getInstance();
  }

  private async readAudioFile(audioFile: File): Promise<string> {
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
  }

  async processRequest(req: Request): Promise<Response> {
    const formData = await req.formData();
    const audioFile = formData.get('file');

    if (!audioFile || !(audioFile instanceof File)) {
      return new Response(JSON.stringify({ error: 'No audio file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!this.model || !this.model.llm) {
      return new Response(JSON.stringify({ error: 'Model not initialized' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // read audio file as base64
      // const base64AudioFile = await this.readAudioFile(audioFile);

      const response = await generateText({
        model: this.model.llm,
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
                data: audioFile,
                mimeType: 'audio/webm',
              },
            ],
          },
        ],
      });

      let transcript = '';

      // get transcript from the result
      const content = response.text;

      console.log('content', content);

      // define the regex pattern to find the json object in content
      const pattern = /{[^{}]*}/;
      // match the pattern
      const match = content.match(pattern);
      if (!match) {
        transcript = '';
      } else {
        // return the text content
        const transcription = JSON.parse(match[0]);
        transcript =
          'text' in transcription ? (transcription.text as string) : '';
      }

      return new Response(JSON.stringify({ transcript }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Google Voice Handler error:', error);
      return new Response(JSON.stringify({ transcript: '' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
