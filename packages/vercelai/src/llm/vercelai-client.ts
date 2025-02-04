import { StreamMessageCallback } from '../types';
import { ReactNode } from 'react';
import { LanguageModel, Message, streamText } from 'ai';
import { extractMaxToolInvocationStep } from '@ai-sdk/ui-utils';
import { shouldTriggerNextRequest, VercelAi } from './vercelai';
import { convertOpenAIToolsToVercelTools } from '../lib/tools';

type ConfigureProps = {
  apiKey?: string;
  model?: string;
  instructions?: string;
  temperature?: number;
  topP?: number;
  description?: string;
  version?: string;
  maxTokens?: number;
};

export class VercelAiClient extends VercelAi {
  protected static apiKey = '';
  protected static model = '';

  protected llm: LanguageModel | null = null;

  protected static instance: VercelAiClient | null = null;

  protected constructor() {
    super();
  }

  public static override configure(config: ConfigureProps) {
    if (config.apiKey) VercelAiClient.apiKey = config.apiKey;
    if (config.model) VercelAiClient.model = config.model;
    if (config.instructions) VercelAiClient.instructions = config.instructions;
    if (config.temperature) VercelAiClient.temperature = config.temperature;
    if (config.topP) VercelAiClient.topP = config.topP;
    if (config.description) VercelAiClient.description = config.description;
  }

  public override restart() {
    this.stop();
    this.messages = [];
    // need to reset the llm so getInstance doesn't return the same instance
    this.llm = null;
  }

  protected async triggerRequest({
    streamMessageCallback,
  }: {
    streamMessageCallback: StreamMessageCallback;
  }) {
    if (!this.llm) {
      throw new Error(
        'LLM instance is not initialized. Please call configure() first if you want to create a client LLM instance.'
      );
    }

    let messageContent: string = '';
    let customMessage: ReactNode | null = null;

    const maxSteps = 4;
    const messageCount = this.messages.length;
    const maxStep = extractMaxToolInvocationStep(
      this.messages[this.messages.length - 1]?.toolInvocations
    );

    const tools = VercelAiClient.tools
      ? convertOpenAIToolsToVercelTools(VercelAiClient.tools)
      : VercelAiClient.tools;

    const { fullStream } = streamText({
      model: this.llm,
      messages: this.messages,
      tools,
      system: VercelAiClient.instructions,
      temperature: VercelAiClient.temperature,
      topP: VercelAiClient.topP,
      maxSteps,
      abortSignal: this.abortController?.signal,
      onFinish: async ({ toolCalls, response }) => {
        // response messages could be CoreAssistantMessage | CoreToolMessage
        const responseMsg = response.messages[response.messages.length - 1];

        // add final message to the messages array
        const message: Message = {
          id: responseMsg.id,
          role: responseMsg.role as 'assistant',
          content: messageContent,
          toolInvocations: [],
        };

        // handle tool calls
        for (const toolCall of toolCalls) {
          const result = await this.proceedToolCall({ toolCall });
          customMessage = result.customMessage;
          message.toolInvocations = [
            {
              toolCallId: toolCall.toolCallId,
              result: result.toolResult,
              state: 'result',
              toolName: toolCall.toolName,
              args: toolCall.args,
            },
          ];
        }

        this.messages?.push(message);
      },
    });

    for await (const chunk of fullStream) {
      if (chunk.type === 'text-delta') {
        messageContent += chunk.textDelta;
        streamMessageCallback({
          deltaMessage: messageContent,
          customMessage,
        });
      } else if (chunk.type === 'tool-call') {
        console.log('tool-call', chunk);
      } else if (chunk.type === 'reasoning') {
        console.log('reasoning', chunk);
      } else if (chunk.type === 'error') {
        console.log('error', chunk);
      }
    }

    // check after LLM response is finished
    // auto-submit when all tool calls in the last assistant message have results:
    if (
      shouldTriggerNextRequest(this.messages, messageCount, maxSteps, maxStep)
    ) {
      await this.triggerRequest({ streamMessageCallback });
    }

    return { customMessage };
  }
}
