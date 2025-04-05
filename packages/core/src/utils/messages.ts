import { Message, generateId } from 'ai';
import { StreamMessage, StreamMessageSchema } from '../types';
import { z } from 'zod';

export type Conversation = {
  prompt: string;
  response: StreamMessage;
};
export const ConversationSchema = z.object({
  prompt: z.string(),
  response: StreamMessageSchema,
});

/**
 * Rebuild the messages from the conversations, which is an array of `{prompt, response}`.
 * The messages are in the format of the Message interface in Vercel AI SDK.
 * This function can be used to restore the messages from the persisted conversations.
 *
 * For example:
 * ```ts
 * const messages = rebuildMessages([
 *   {
 *     prompt: 'What is the capital of France?',
 *     response: { text: 'Paris' },
 *   },
 * ]);
 *
 * // create assistant
 * const assistant = createAssistant({
 *   model: 'gpt-4o',
 * });
 *
 * assistant.setMessages(messages);
 * ```
 *
 * @param conversations The conversations to rebuild the messages from
 * @returns The messages used in the Vercel AI SDK
 */
export function rebuildMessages(conversations: Conversation[]): Message[] {
  const result: Message[] = [];

  for (const msg of conversations) {
    // Handle user messages
    result.push({
      id: generateId(), // Generate random ID
      role: 'user',
      content: msg.prompt,
      parts: [
        {
          type: 'text',
          text: msg.prompt,
        },
      ],
    });

    // Handle assistant messages with tool calls
    if (msg.response?.toolCallMessages?.length) {
      // Add tool invocations message
      result.push({
        id: generateId(),
        role: 'assistant',
        content: '',
        toolInvocations: msg.response.toolCallMessages.map((tool, index) => ({
          toolCallId: tool.toolCallId,
          result: tool.llmResult,
          state: 'result',
          toolName: tool.toolName,
          args: tool.args,
          step: index + 1,
        })),
      });
    }

    // Add final response message
    result.push({
      id: generateId(),
      role: 'assistant',
      content: msg.response.text || '',
      toolInvocations: [],
    });
  }

  return result;
}
