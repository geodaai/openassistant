import { OpenAI } from 'openai';

/**
 * Handles voice transcription requests
 */
export class VoiceHandler {
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
        return new Response(JSON.stringify({ error: 'No audio file provided' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
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
