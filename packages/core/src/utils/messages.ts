import { Message } from 'ai';
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

export function rebuildMessages(conversations: Conversation[]): Message[] {
  const result: Message[] = [];

  for (const msg of conversations) {
    // Handle user messages
    result.push({
      id: Math.random().toString(36).substring(2), // Generate random ID
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
        id: `msg-${Math.random().toString(36).substring(2)}`,
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
      id: `msg-${Math.random().toString(36).substring(2)}`,
      role: 'assistant',
      content: msg.response.text || '',
      toolInvocations: [],
    });
  }

  return result;
}
