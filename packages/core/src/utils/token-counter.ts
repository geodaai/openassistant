import { encodingForModel } from '@langchain/core/utils/tiktoken';
import { ToolInvocation } from 'ai';
import { Tiktoken } from 'js-tiktoken/lite';
import { AIMessage } from 'src/types';

let cachedEncoding: Tiktoken | null = null;

async function strTokenCounter(messageContent: string): Promise<number> {
  if (!cachedEncoding) {
    cachedEncoding = await encodingForModel('gpt-4');
  }

  if (typeof messageContent === 'string') {
    return cachedEncoding.encode(messageContent).length;
  }

  throw new Error(
    `Unsupported message content ${JSON.stringify(messageContent)}`
  );
}

export async function tiktokenCounter(
  messages: Array<AIMessage>
): Promise<number> {
  let numTokens = 0;
  for (const msg of messages) {
    numTokens += await tiktokenCounterPerMessage(msg);
  }
  return numTokens;
}

export async function tiktokenCounterPerMessage(
  msg: AIMessage
): Promise<number> {
  let numTokens = 3; // every reply is primed with <|start|>assistant<|message|>
  const tokensPerMessage = 3;
  const tokensPerName = 1;

  numTokens += tokensPerMessage;
  numTokens += await strTokenCounter(msg.role);
  if (typeof msg.content === 'string') {
    numTokens += await strTokenCounter(msg.content);
  } else if (typeof msg.content === 'object' && 'type' in msg.content) {
    if (msg.content.type === 'text' && 'text' in msg.content) {
      numTokens += await strTokenCounter(msg.content.text as string);
    } else if (msg.content.type === 'image' && 'image' in msg.content) {
      numTokens += await strTokenCounter(msg.content.image as string);
    }
  }

  if ('id' in msg && msg.id) {
    numTokens += tokensPerName + (await strTokenCounter(msg.id));
  }

  // Handle function calls if present
  if ('toolInvocations' in msg && msg.toolInvocations) {
    for (const toolInvocation of msg.toolInvocations) {
      const { toolName, args } = toolInvocation as ToolInvocation;
      numTokens += await strTokenCounter(toolName);
      numTokens += await strTokenCounter(JSON.stringify(args));
      if (toolInvocation.state === 'result') {
        numTokens += await strTokenCounter(toolInvocation.result);
      }
    }
  }

  return numTokens;
}
