import { encodingForModel } from './tiktoken';
import { Message } from 'ai';

async function strTokenCounter(
  messageContent: string | { function_call: { name: string; arguments: string } }
): Promise<number> {
  const encoding = await encodingForModel('gpt-4');

  if (typeof messageContent === 'string') {
    return encoding.encode(messageContent).length;
  }

  // Handle function calls
  if ('function_call' in messageContent) {
    const functionCall = messageContent.function_call;
    return encoding.encode(functionCall.name).length + 
           encoding.encode(functionCall.arguments).length;
  }

  throw new Error(
    `Unsupported message content ${JSON.stringify(messageContent)}`
  );
}

export async function tiktokenCounter(messages: Message[]): Promise<number> {
  let numTokens = 3; // every reply is primed with <|start|>assistant<|message|>
  const tokensPerMessage = 3;
  const tokensPerName = 1;

  for (const msg of messages) {
    numTokens += tokensPerMessage +
                 (await strTokenCounter(msg.role)) +
                 (await strTokenCounter(msg.content));

    if (msg.id) {
      numTokens += tokensPerName + (await strTokenCounter(msg.id));
    }

    // Handle function calls if present
    if (msg.toolInvocations) {
      numTokens += await strTokenCounter({ function_call: {
        name: msg.toolInvocations[0].toolName,
        arguments: msg.toolInvocations[0].args
      }});
    }
  }
  return numTokens;
}
