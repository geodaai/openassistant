import { openai } from '@ai-sdk/openai';
import { ConversationCache } from '@openassistant/utils';
import { createDataStreamResponse, streamText } from 'ai';
import { createTools } from '../../lib/tools';

// Create a conversation cache instance with custom configuration
const conversationCache = new ConversationCache({
  maxConversations: 100,
  ttlMs: 1000 * 60 * 60 * 2, // 2 hours
  cleanupProbability: 0.1, // 10%
  enableLogging: true, // Enable logging for debugging
});

const systemPrompt = `You are a helpful assistant that can answer questions and help with tasks. 
You can use the following datasets:
- datasetName: natregimes
- variables: [HR60, PO60, latitude, longitude]
- datasetName: world_countries
- variables: [id, latitude, longitude]
`;

export async function POST(req: Request) {
  const { id: requestId, messages } = await req.json();

  // Get conversation-scoped ToolOutputManager
  const toolOutputManager =
    await conversationCache.getToolOutputManager(requestId);

  // Start a new session to track tool outputs for this specific request
  const sessionId = await toolOutputManager.startSession();

  // Log cache status for this conversation
  const cacheInfo = await toolOutputManager.getAllToolOutputs();
  console.log(
    `Conversation ${requestId}: Found ${cacheInfo.length} cached tool outputs`
  );

  // Create all tools using the tools utility
  const tools = createTools(toolOutputManager);

  return createDataStreamResponse({
    execute: (dataStream) => {
      try {
        const result = streamText({
          model: openai('gpt-4o'),
          messages: messages,
          system: systemPrompt,
          tools,
          async onFinish() {
            // Only write tool data to client if tools were actually called in THIS request
            const hasToolOutputsInSession =
              await toolOutputManager.hasToolOutputsInCurrentSession();
            if (hasToolOutputsInSession) {
              const lastToolData =
                await toolOutputManager.getLastToolOutputFromCurrentSession();
              if (lastToolData) {
                console.log('write toolData back to client', lastToolData);
                // @ts-expect-error - toolAdditionalData is a record of unknown values
                dataStream.writeMessageAnnotation(lastToolData);
              }
            }

            // End the session when request is complete
            await toolOutputManager.endSession();
          },
        });

        result.mergeIntoDataStream(dataStream);
      } catch (error) {
        // Ensure session is ended even on error
        toolOutputManager.endSession().catch(console.error);
        throw error;
      }
    },
    onError: (error) => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });
}

// Debug endpoint to check cache status
// export async function GET() {
//   const cacheStatus = await conversationCache.getStatus();
//   return Response.json(cacheStatus);
// }
