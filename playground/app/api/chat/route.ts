import { openai } from '@ai-sdk/openai';
import { ChatHandler } from '@openassistant/vercelai';

/**
 * POST endpoint handler for chat requests
 * @param {Request} req - Incoming request object
 * @returns {Promise<Response>} Chat response
 */
export async function POST(req: Request) {
  const model = openai('gpt-4o');
  // Example of using ChatHandler with predefined tools and instructions
  const handler = new ChatHandler({ 
    model,
    // tools: predefinedTools,  // Optional
    // instructions: "Default system instructions"  // Optional
  });
  return handler.processRequest(req);
}
