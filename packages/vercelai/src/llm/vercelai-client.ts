import { AudioToTextProps, StreamMessageCallback } from '../types';
import { ReactNode } from 'react';
import { generateText, LanguageModel, Message, streamText } from 'ai';
import { extractMaxToolInvocationStep } from '@ai-sdk/ui-utils';
import { shouldTriggerNextRequest, VercelAi } from './vercelai';
import { convertOpenAIToolsToVercelTools } from '../lib/tool-utils';

export type VercelAiClientConfigureProps = {
  apiKey?: string;
  model?: string;
  instructions?: string;
  temperature?: number;
  topP?: number;
  description?: string;
  version?: string;
  maxTokens?: number;
};

/**
 * Abstract Vercel AI Client for Client only
 */
export abstract class VercelAiClient extends VercelAi {
  protected static apiKey = '';

  protected static model = '';

  protected llm: LanguageModel | null = null;

  protected static instance: VercelAiClient | null = null;

  protected constructor() {
    super();
  }

  public static override configure(config: VercelAiClientConfigureProps) {
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

  /**
   * Trigger the request to the Vercel AI API
   * Override the triggerRequest method to call LLM with Vercel AI SDK from local e.g. browser
   * @param streamMessageCallback - The callback function to stream the message
   * @returns The custom message
   */
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
      } else if (chunk.type === 'reasoning') {
        messageContent += chunk.textDelta;
        streamMessageCallback({
          deltaMessage: messageContent,
          customMessage,
        }); 
      } else if (chunk.type === 'error') {
        throw new Error(`Error from Vercel AI API: ${chunk.error}`);
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

  public override async audioToText({
    audioBlob,
  }: AudioToTextProps): Promise<string> {
    if (!this.llm) {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
    if (!audioBlob) {
      throw new Error('audioBlob is null');
    }
    if (!this.abortController) {
      this.abortController = new AbortController();
    }

    const file = new File([audioBlob], 'audio.webm');

    const response = await generateText({
      model: this.llm,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Translating audio to text, and return plain text based on the following schema: {text: content}',
            },
            {
              type: 'file',
              data: file,
              mimeType: 'audio/webm',
            },
          ],
        },
      ],
    });

    return response.text;
  }
}
