import { openai } from "@ai-sdk/openai";
import { VoiceHandler } from '@openassistant/vercelai';

const handler = new VoiceHandler({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  return handler.processRequest(req);
}
