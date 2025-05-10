import {
  AudioToTextProps,
  StreamMessageCallback,
  ToolCallMessage,
} from '../types';
import {
  generateText,
  LanguageModel,
  LanguageModelUsage,
  streamText,
  Tool,
  ToolChoice,
  ToolSet,
  StepResult,
  TextPart,
} from 'ai';
import {
  Message,
  ToolInvocation,
  ToolInvocationUIPart,
  extractMaxToolInvocationStep,
} from '@ai-sdk/ui-utils';
import { shouldTriggerNextRequest, VercelAi } from './vercelai';
import { tiktokenCounter } from '../utils/token-counter';

/**
 * Configuration properties for VercelAiClient
 * @interface
 */
export type VercelAiClientConfigureProps = {
  /** API key for authentication */
  apiKey?: string;
  /** Model name to use */
  model?: string;
  /** System instructions for the model */
  instructions?: string;
  /** Temperature for controlling randomness (0-1) */
  temperature?: number;
  /** Top P sampling parameter (0-1) */
  topP?: number;
  /** Description of the assistant */
  description?: string;
  /** Version of the model */
  version?: string;
  /** Maximum tokens to generate */
  maxTokens?: number;
  /** Base URL for API requests */
  baseURL?: string;
  /** Tool choice configuration */
  toolChoice?: ToolChoice<ToolSet>;
  /** Maximum number of tool call steps */
  maxSteps?: number;
  /** Tool call streaming */
  toolCallStreaming?: boolean;
};

/**
 * Abstract Vercel AI Client for client-side usage. Extends the VercelAi class to handle
 * LLM interactions directly from the browser using Vercel AI SDK instead of API endpoints.
 *
 * @abstract
 * @extends {VercelAi}
 */
export abstract class VercelAiClient extends VercelAi {
  /** API key for authentication */
  protected static apiKey = '';

  /** Model name to use */
  protected static model = '';

  /** Base URL for API requests */
  protected static baseURL = '';

  /** Language model instance */
  public llm: LanguageModel | null = null;

  /** Singleton instance */
  protected static instance: VercelAiClient | null = null;

  /**
   * Gets the base URL for API requests
   * @abstract
   * @throws {Error} Always throws as this is an abstract class
   */
  public static getBaseURL() {
    throw new Error('No base URL for VercelAiClient. It is an abstract class.');
  }

  /**
   * Validates that a model has been configured
   * @protected
   * @throws {Error} If model is not configured
   */
  protected static checkModel() {
    if (!VercelAiClient.model || VercelAiClient.model.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  /**
   * Validates that an API key has been configured
   * @protected
   * @throws {Error} If API key is not configured
   */
  protected static checkApiKey() {
    if (!VercelAiClient.apiKey || VercelAiClient.apiKey.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  /**
   * Protected constructor to prevent direct instantiation
   * @protected
   */
  protected constructor() {
    super();
  }

  /**
   * Configures the client with the provided settings
   * @param {VercelAiClientConfigureProps} config - Configuration options
   */
  public static override configure(config: VercelAiClientConfigureProps) {
    if (config.apiKey) VercelAiClient.apiKey = config.apiKey;
    if (config.model) VercelAiClient.model = config.model;
    if (config.instructions) VercelAiClient.instructions = config.instructions;
    if (config.temperature !== undefined)
      VercelAiClient.temperature = config.temperature;
    if (config.topP !== undefined) VercelAiClient.topP = config.topP;
    if (config.description) VercelAiClient.description = config.description;
    if (config.baseURL) VercelAiClient.baseURL = config.baseURL;
    if (config.toolChoice) VercelAiClient.toolChoice = config.toolChoice;
    if (config.maxSteps !== undefined)
      VercelAiClient.maxSteps = config.maxSteps;
  }

  /**
   * Restarts the chat by clearing messages and resetting the LLM instance
   */
  public override restart() {
    this.stop();
    this.setMessages([]);
    // need to reset the llm so getInstance doesn't return the same instance
    this.llm = null;
    VercelAiClient.instance = null;
  }

  /**
   * Trims messages to stay within token limits
   * @protected
   * @returns {Promise<Message[]>} Trimmed messages array
   */
  protected async trimMessages() {
    let totalTokens = await tiktokenCounter(this.messages);

    // add token for the system message
    totalTokens += await tiktokenCounter([
      { role: 'system', content: VercelAi.instructions, id: 'system' },
    ]);

    // add token for the tools
    if (VercelAi.tools) {
      totalTokens += await tiktokenCounter(
        Object.values(VercelAi.tools).map((tool: Tool) => ({
          role: 'assistant',
          content: JSON.stringify(tool.parameters),
          id: 'tool',
        }))
      );
    }

    if (totalTokens <= VercelAi.maxTokens) {
      return this.messages;
    }
    // make a copy of the messages array
    const updatedMessages = this.messages.slice(0);

    if (totalTokens > VercelAi.maxTokens) {
      // remove one message at a time
      while (updatedMessages.length > 0) {
        const removedMessage = updatedMessages.shift();
        const remainingTokens = await tiktokenCounter([removedMessage!]);
        totalTokens -= remainingTokens;

        if (totalTokens <= VercelAi.maxTokens) {
          break;
        }
      }
    }

    return updatedMessages;
  }

  protected async handleToolCallStreaming(
    toolCallId: string,
    toolName: string,
    args: Record<string, unknown>,
    streamMessageCallback: StreamMessageCallback
  ) {
    const toolInvocation: ToolInvocation = {
      state: 'call',
      toolCallId,
      toolName,
      args,
    };

    this.streamMessage.parts?.push({
      type: 'tool-invocation',
      toolInvocation,
    });

    if (streamMessageCallback) {
      streamMessageCallback({
        deltaMessage: '',
        message: this.streamMessage,
        isCompleted: false,
      });
    }
  }

  protected async handleToolCallFinish(
    toolCallId: string,
    result: unknown,
    streamMessageCallback: StreamMessageCallback
  ) {
    // find the tool invocation in the stream message
    const toolPart = this.streamMessage.parts?.findLast(
      (part) =>
        part.type === 'tool-invocation' &&
        part.toolInvocation.toolCallId === toolCallId
    ) as ToolInvocationUIPart & { additionalData: unknown };

    // update the tool invocation in the stream message
    toolPart.toolInvocation = {
      ...toolPart.toolInvocation,
      state: 'result',
      result,
    };

    // update the additional data
    const additionalData = VercelAi.toolResults?.[toolCallId];
    if (additionalData) {
      toolPart.additionalData = additionalData;
    }

    // update the stream message
    streamMessageCallback({
      deltaMessage: '',
      message: this.streamMessage,
    });
  }

  protected async handleTextStreaming(
    textDelta: string,
    messageContent: string,
    streamMessageCallback: StreamMessageCallback
  ): Promise<string> {
    if (messageContent.length === 0) {
      // add text part at the beginning of text streaming
      this.streamMessage.parts?.push({
        type: 'text',
        text: '',
      });
    }
    messageContent += textDelta;
    // find last text part
    const lastTextPart = this.streamMessage.parts?.findLast(
      (part) => part.type === 'text'
    );
    if (lastTextPart) {
      (lastTextPart as TextPart).text += textDelta;
    }
    streamMessageCallback({
      deltaMessage: messageContent,
      message: this.streamMessage,
    });
    return messageContent;
  }

  /**
   * Triggers a request to the Vercel AI API using the local LLM instance
   * @protected
   * @param {Object} params - Request parameters
   * @param {StreamMessageCallback} params.streamMessageCallback - Callback for streaming messages
   * @param {string} [params.imageMessage] - Image message in base64 format
   * @param {Function} [params.onStepFinish] - Optional callback for step completion
   * @returns {Promise<TriggerRequestOutput>} Request output
   * @throws {Error} If LLM is not initialized
   */
  protected async triggerRequest({
    streamMessageCallback,
    onStepFinish,
  }: {
    streamMessageCallback: StreamMessageCallback;
    onStepFinish?: (
      event: StepResult<ToolSet>,
      toolCallMessages: ToolCallMessage[]
    ) => Promise<void> | void;
  }) {
    if (!this.llm) {
      throw new Error(
        'LLM instance is not initialized. Please call configure() first if you want to create a client LLM instance.'
      );
    }

    // make a copy of the messages array, so we can modify it in callbacks e.g. onStepFinish
    const localMessages = [...this.getMessages()];

    let messageContent: string = '';
    const tokensUsed: LanguageModelUsage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };

    // total max steps
    const maxSteps = VercelAiClient.maxSteps || 20;
    const messageCount = localMessages.length;

    const lastMessage = localMessages[localMessages.length - 1];
    const toolInvocations = (lastMessage as Message).parts
      ?.filter((part) => part.type === 'tool-invocation')
      .map((part) => (part as ToolInvocationUIPart).toolInvocation);

    // current max step
    const maxStep = toolInvocations
      ? extractMaxToolInvocationStep(toolInvocations)
      : undefined;

    const tools = VercelAiClient.tools;

    const { fullStream } = streamText({
      model: this.llm,
      messages: localMessages,
      tools,
      toolCallStreaming: false, // TODO: disable tool call streaming for now
      toolChoice: VercelAiClient.toolChoice,
      system: VercelAiClient.instructions,
      temperature: VercelAiClient.temperature,
      ...(VercelAiClient.topP !== undefined && { topP: VercelAiClient.topP }),
      maxSteps,
      abortSignal: this.abortController?.signal,
      onStepFinish: async (event: StepResult<ToolSet>) => {
        const { usage } = event;
        tokensUsed.promptTokens = usage?.promptTokens || 0;
        tokensUsed.completionTokens = usage?.completionTokens || 0;
        tokensUsed.totalTokens = usage?.totalTokens || 0;
        localMessages.push(...event.response.messages);
      },
    });

    for await (const chunk of fullStream) {
      if (chunk.type === 'step-start') {
        console.log('step-start', chunk);
      } else if (chunk.type === 'text-delta') {
        messageContent = await this.handleTextStreaming(
          chunk.textDelta,
          messageContent,
          streamMessageCallback
        );
      } else if (chunk.type === 'tool-call') {
        // reset message content if tool call is started
        messageContent = '';
        await this.handleToolCallStreaming(
          chunk.toolCallId,
          chunk.toolName,
          chunk.args,
          streamMessageCallback
        );
        // @ts-expect-error TODO: fix type
      } else if (chunk.type === 'tool-result') {
        const { toolCallId, result } = chunk;
        await this.handleToolCallFinish(
          toolCallId,
          result,
          streamMessageCallback
        );
      } else if (chunk.type === 'reasoning') {
        messageContent = await this.handleTextStreaming(
          chunk.textDelta,
          messageContent,
          streamMessageCallback
        );
      } else if (chunk.type === 'error') {
        throw new Error(`Error from Vercel AI API: ${chunk.error}`);
      }
    }

    // update messages
    this.setMessages(localMessages);

    // check after LLM response is finished
    // auto-submit when all tool calls in the last assistant message have results:
    if (
      shouldTriggerNextRequest(localMessages, messageCount, maxSteps, maxStep)
    ) {
      await this.triggerRequest({
        streamMessageCallback,
        onStepFinish,
      });
    }

    return { tokensUsed };
  }

  /**
   * Converts audio to text using the configured LLM
   * @param {AudioToTextProps} params - Audio conversion parameters
   * @returns {Promise<string>} Transcribed text
   * @throws {Error} If LLM is not configured or audio blob is missing
   */
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
    const arrayBuffer = await file.arrayBuffer();

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
              data: arrayBuffer,
              mimeType: 'audio/webm',
            },
          ],
        },
      ],
    });

    return response.text;
  }
}
