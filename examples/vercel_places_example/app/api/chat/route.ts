// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

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

const systemPrompt = `You are a helpful assistant that can help with location-based queries and place searches. 
You can use the following tools:
- geotagging: Find places near a specific location using Foursquare's Snap to Place technology
- placeSearch: Search for places using Foursquare's Places API
- geocoding: Convert addresses to coordinates
- routing: Find routes between two points
- isochrone: Get reachable areas within a time limit from a starting point
- buffer: Create buffer zones around geometries
- downloadMapData: Download map data for visualization
- keplergl: Visualize data on interactive maps

You can help users find places, get directions, analyze spatial data, and create visualizations.

Please explain the steps you take to answer the user's question.

Please use markdown to format your response.

Please use emojis to make your response more engaging.
`;

export async function POST(req: Request) {
  console.log('🚀 POST /api/chat - Request started');
  
  try {
    const { id: requestId, messages } = await req.json();
    console.log('📨 Request data:', { 
      requestId, 
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]?.content?.substring(0, 100) + '...'
    });

    // Get conversation-scoped ToolOutputManager
    const toolOutputManager =
      await conversationCache.getToolOutputManager(requestId);

  // Start a new session to track tool outputs for this specific request
  await toolOutputManager.startSession();

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
  } catch (error) {
    console.error('❌ Error in POST /api/chat:', error);
    throw error;
  }
}

// Debug endpoint to check cache status
export async function GET() {
  const cacheStatus = await conversationCache.getStatus();
  return Response.json(cacheStatus);
} 