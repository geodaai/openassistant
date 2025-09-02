// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * Example demonstrating how to update UiMessages after onFinish, borrowing patterns from useChat
 *
 * This example shows how to implement a message management system similar to useChat:
 *
 * 1. **Message Manager**: Centralized state management for UiMessages array
 *    - addMessage(): Add new messages to the array
 *    - updateLastMessage(): Update the last message (useful for streaming)
 *    - getMessages(): Get current messages array
 *
 * 2. **onFinish Handler**: Creates and adds UiMessage after completion
 *    - Extracts text content and tool calls from the result
 *    - Creates properly structured UiMessage with parts
 *    - Adds the message to the message manager
 *
 * 3. **onChunk Handler**: Optional real-time updates during streaming
 *    - Shows how to create streaming UiMessages
 *    - Demonstrates real-time message updates
 *
 * 4. **Tool Call Support**: Handles tool invocations similar to useChat
 *    - Creates tool-invocation parts with proper state
 *    - Supports both text and tool call responses
 *
 * Key Benefits:
 * - Maintains message history like useChat
 * - Supports both text and tool call responses
 * - Provides real-time streaming updates
 * - Centralized message state management
 */

import dotenv from 'dotenv';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  DefaultChatTransport,
  readUIMessageStream,
  streamText,
  UIMessagePart,
} from 'ai';
import { extendedTool } from '@openassistant/utils';

// Define UIMessage type based on AI SDK v5 structure
type UIMessage = {
  id: string;
  role: 'user' | 'assistant' | 'tool' | 'system';
  parts: Array<UIMessagePart<any, any>>;
};

// Load environment variables
dotenv.config();

async function main() {
  // Check if API key is available
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Please set OPENAI_API_KEY environment variable');
    process.exit(1);
  }
  // Initialize the model
  const openai = createOpenAI({
    apiKey: apiKey,
  });

  console.log('🤖 Simple Vercel AI SDK v5 Example with TypeScript');
  console.log('Type "exit" to quit\n');

  // tools
  const weather = extendedTool({
    description: 'Get the weather in a city from a weather station',
    parameters: z.object({ cityName: z.string(), reason: z.string() }),
    execute: async ({ cityName, reason }, options) => {
      const context = options?.context;

      const station = context?.getStation
        ? await context.getStation(cityName)
        : null;
      const temperature = context?.getTemperature
        ? await context.getTemperature(cityName)
        : null;

      // throw new Error('Get temperature error: the station is down.');
      return {
        llmResult: {
          success: true,
          message: `The temperature in ${cityName} is ${temperature} degrees from weather station ${station}.`,
        },
        additionalData: {
          cityName,
          temperature,
          station,
          reason,
        },
      };
    },
    context: {
      getStation: async (cityName: string) => {
        const stations: Record<string, string> = {
          'New York': '123',
          'Los Angeles': '456',
          Chicago: '789',
        };
        return stations[cityName];
      },
      getTemperature: async (cityName: string) => {
        const temperatures: Record<string, number> = {
          'New York': 70,
          'Los Angeles': 80,
          Chicago: 60,
        };
        return temperatures[cityName];
      },
    },
  });

  // @ts-ignore - TypeScript tool definition issues with AI SDK v5
  const tools = {
    weatherTool: {
      description: weather.description,
      inputSchema: weather.parameters,
      execute: async (args: Record<string, unknown>, options: any) => {
        const result = await weather.execute(args as any, {
          ...options,
          context: weather.context,
        });

        console.log('weather tool result', result);

        if (options.toolCallId && weather.onToolCompleted) {
          weather.onToolCompleted(options.toolCallId, result.additionalData);
        }

        return result.llmResult;
      },
    },
  };
  // messages
  let uiMessages: UIMessage[] = [
    {
      id: '1',
      role: 'user',
      parts: [
        {
          type: 'text',
          text: 'which city is warmer, New York or Los Angeles?',
        },
      ],
    },
  ];

  // Message management system similar to useChat
  const messageManager = {
    messages: uiMessages,
    processedMessageIds: new Set<string>(), // Track processed messages to prevent infinite recursion

    // Add a new message to the array
    addMessage: (message: UIMessage) => {
      messageManager.messages = [...messageManager.messages, message];
      console.log('Added message:', message);
      console.log('Updated messages array:', messageManager.messages);
    },

    // Update the last message (useful for streaming updates)
    updateLastMessage: (updates: Partial<UIMessage>) => {
      if (messageManager.messages.length > 0) {
        const lastIndex = messageManager.messages.length - 1;
        messageManager.messages[lastIndex] = {
          ...messageManager.messages[lastIndex],
          ...updates,
        };
      }
    },

    // Get current messages
    getMessages: () => messageManager.messages,

    // Mark a message as processed
    markAsProcessed: (messageId: string) => {
      messageManager.processedMessageIds.add(messageId);
    },

    // Check if a message has been processed
    isProcessed: (messageId: string) => {
      return messageManager.processedMessageIds.has(messageId);
    },
  };

  const triggerStream = async (init?: RequestInit): Promise<Response> => {
    let accumulatedText = '';
    let accumulatedReasoning = '';

    const result = await streamText({
      model: openai('gpt-4.1'),
      system: 'You are a helpful assistant.',
      messages: convertToModelMessages(messageManager.getMessages() as any),
      tools: tools as any,
      abortSignal: init?.signal as AbortSignal | undefined,
      onStepFinish: async ({ response }) => {
        console.log('Step finish:', response.messages);
        // uiMessages.push(...response.messages);
      },
      onFinish: async ({
        text,
        finishReason,
        usage,
        toolCalls,
        toolResults,
        response,
      }) => {
        console.log('Complete response:', text);
        console.log('Finish reason:', finishReason);
        console.log('Usage:', usage);
        console.log('Tool calls:', toolCalls);
        console.log('Tool results:', toolResults);
        console.log('Response messages:', JSON.stringify(response?.messages));

        // Create uiMessages from toolCalls and toolResults in response.messages
        if (response?.messages && response?.messages.length > 0) {
          const assistantMessage = response.messages.find(
            (msg) => msg.role === 'assistant'
          );
          const toolMessage = response.messages.find(
            (msg) => msg.role === 'tool'
          );

          if (
            toolMessage &&
            assistantMessage &&
            Array.isArray(assistantMessage?.content) &&
            Array.isArray(toolMessage?.content)
          ) {
            // Create a map of toolCallId to toolResult for easy lookup
            const toolResultMap = new Map();
            toolMessage.content.forEach((result: any) => {
              if (result.type === 'tool-result') {
                toolResultMap.set(result.toolCallId, result);
              }
            });

            // Process each tool call and create corresponding uiMessage
            assistantMessage.content.forEach((toolCall: any) => {
              if (toolCall.type === 'tool-call') {
                const toolResult = toolResultMap.get(toolCall.toolCallId);

                // Determine state based on output type
                let state = 'output-available';
                if (toolResult?.output?.type === 'error-text') {
                  state = 'output-error';
                }

                const uiMessage: UIMessage = {
                  id: toolCall.toolCallId,
                  role: 'assistant',
                  parts: [
                    {
                      type: `tool-${toolCall.toolName}`,
                      toolCallId: toolCall.toolCallId,
                      state: state as 'output-available' | 'output-error',
                      errorText:
                        state === 'output-error'
                          ? toolResult?.output?.errorText
                          : undefined,
                      input: toolCall.input,
                      output: toolResult?.output || null,
                    },
                  ],
                };

                messageManager.addMessage(uiMessage);
              }
            });
          }
        }
      },
    });

    for await (const chunk of result.fullStream) {
      if (chunk.type === 'text-delta') {
        if (chunk.type === 'text-delta') {
          // if accumulatedText is not empty, update the last message
          if (accumulatedText) {
            messageManager.updateLastMessage({
              parts: [{ type: 'text', text: accumulatedText + chunk.text }],
            });
          } else {
            messageManager.addMessage({
              id: '1',
              role: 'assistant',
              parts: [{ type: 'text', text: chunk.text }],
            });
          }
          accumulatedText += chunk.text;
        }
      } else if (chunk.type === 'reasoning-delta') {
        if (accumulatedReasoning) {
          messageManager.updateLastMessage({
            parts: [
              { type: 'reasoning', text: accumulatedReasoning + chunk.text },
            ],
          });
        } else {
          messageManager.addMessage({
            id: '1',
            role: 'assistant',
            parts: [{ type: 'reasoning', text: chunk.text }],
          });
        }
        accumulatedReasoning += chunk.text;
      }
    }

    // check last message if there are tool calls that need to be processed
    const messages = messageManager.getMessages();
    const lastMessage = messages[messages.length - 1];

    // Only trigger a new stream if:
    // 1. There is a last message
    // 2. It's from the assistant
    // 3. It has tool calls with 'output-available' state
    // 4. We haven't already processed this message (to prevent infinite recursion)
    if (
      lastMessage?.role === 'assistant' &&
      lastMessage.parts.some(
        (part) =>
          'state' in part &&
          (part.state === 'output-available' || part.state === 'output-error')
      ) &&
      !messageManager.isProcessed(lastMessage.id)
    ) {
      console.log('Tool calls completed, triggering new stream...');
      messageManager.markAsProcessed(lastMessage.id);
      return await triggerStream(init);
    }

    const response = result.toUIMessageStream();

    // Consume each UIMessage as it updates
    for await (const uiMessage of readUIMessageStream({ stream: response })) {
      // console.log('Current message state:', uiMessage);
    }

    return result.toUIMessageStreamResponse();
  };

  // Custom fetch function that handles the AI processing locally
  // This demonstrates the useChat pattern for updating UiMessages:
  // 1. onChunk: Real-time streaming updates (optional)
  // 2. onFinish: Final message creation and addition to message array
  // 3. Message manager: Centralized message state management
  // 4. Automatic resubmission after tool calls complete (like sendAutomaticallyWhen)
  const chatTransport = new DefaultChatTransport({
    fetch: async (_input: RequestInfo | URL, init?: RequestInit) => {
      return await triggerStream(init);
    },
  });

  const abortController = new AbortController();

  const readableStream = await chatTransport.sendMessages({
    trigger: 'submit-message',
    chatId: '',
    messageId: '',
    messages: uiMessages as any,
    abortSignal: abortController.signal,
  });

  // Properly consume the entire stream
  const reader = readableStream.getReader();

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        console.log('Stream completed');
        break;
      }
      // console.log('Stream chunk:', value);
    }
  } catch (error) {
    console.error('Stream error:', error);
  } finally {
    reader.releaseLock();
  }

  // Demonstrate accessing the updated UiMessages after the stream completes
  console.log('\n=== Final UiMessages Array ===');
  console.log('Total messages:', messageManager.getMessages().length);
  messageManager.getMessages().forEach((msg, index) => {
    console.log(`Message ${index + 1}:`, JSON.stringify(msg));
  });
}

main().catch(console.error);
