import { openai } from '@ai-sdk/openai';
import { WhisperVoiceHandler } from '@openassistant/core';

const whisperHandler = new WhisperVoiceHandler({
  apiKey: process.env.OPENAI_API_KEY,
});

// const geminiHandler = new GeminiVoiceHandler({
//   apiKey: process.env.GEMINI_API_KEY,
// });

export async function POST(req: Request) {
  return whisperHandler.processRequest(req);
}
