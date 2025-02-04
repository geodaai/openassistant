import { openai } from '@ai-sdk/openai';
import { ChatHandler } from '@openassistant/vercelai';

// Create a chat handler instance to handle the chat requests using a specific LLM model
const handler = new ChatHandler({
  model: openai('gpt-4o'),
  // tools: predefinedTools,  // Optional
  // instructions: "Default system instructions"  // Optional
});

/**
 * POST endpoint handler for chat requests
 * @param {Request} req - Incoming request object
 * @returns {Promise<Response>} Chat response
 */
export async function POST(req: Request) {
  return handler.processRequest(req);
}

// Optionally add a way to clear history
export async function DELETE() {
  handler.clearHistory();
  return new Response('History cleared', { status: 200 });
}
