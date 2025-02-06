import { tiktokenCounter } from './token-counter';
import { Tool, ToolSet, CoreMessage } from 'ai';
import { Message } from '@ai-sdk/ui-utils';

export async function trimMessages({
  messages,
  instructions,
  tools,
  maxTokens,
}: {
  messages: Array<Message | CoreMessage>;
  instructions: string;
  tools: ToolSet;
  maxTokens: number;
}) {
  let totalTokens = await tiktokenCounter(messages);

  // add token for the system message
  totalTokens += await tiktokenCounter([
    { role: 'system', content: instructions, id: 'system' },
  ]);

  // add token for the tools
  if (tools) {
    totalTokens += await tiktokenCounter(
      Object.values(tools).map((tool: Tool) => ({
        role: 'assistant',
        content: JSON.stringify(tool.parameters),
        id: 'tool',
      }))
    );
  }

  if (totalTokens <= maxTokens) {
    return messages;
  }
  // make a copy of the messages array
  const updatedMessages = messages.slice(0);

  if (totalTokens > maxTokens) {
    // remove one message at a time
    while (updatedMessages.length > 0) {
      const removedMessage = updatedMessages.shift();
      const remainingTokens = await tiktokenCounter([removedMessage!]);
      totalTokens -= remainingTokens;

      if (totalTokens <= maxTokens) {
        break;
      }
    }
  }

  return updatedMessages;
}
