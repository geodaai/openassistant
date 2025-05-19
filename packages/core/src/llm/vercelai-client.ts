import {
  AudioToTextProps,
  CustomFunctionOutputProps,
  StreamMessageCallback,
  ToolCallMessage,
  TextPart,
} from '../types';
import { ReactNode } from 'react';
import {
  generateText,
  LanguageModel,
  LanguageModelUsage,
  streamText,
  Tool,
  ToolChoice,
  ToolSet,
  StepResult,
  CoreMessage,
} from 'ai';
import {
  Message,
  extractMaxToolInvocationStep,
  generateId,
} from '@ai-sdk/ui-utils';
import {
  shouldTriggerNextRequest,
  TriggerRequestOutput,
  VercelAi,
} from './vercelai';
import { tiktokenCounter } from '../utils/token-counter';
import { proceedToolCall } from '../utils/toolcall';

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

  /**
   * Checks if a tool invocation is a duplicate of the last one
   * @protected
   * @param {Message} message - Message to check
   * @returns {boolean} True if duplicate
   */
  protected isDuplicateToolInvocation(message: Message): boolean {
    if (!message.toolInvocations?.length) return false;

    const lastMessage = this.messages[this.messages.length - 1] as Message;
    if (!lastMessage?.toolInvocations?.length) return false;

    return (
      message.toolInvocations[0].toolName ===
        lastMessage.toolInvocations[0].toolName &&
      JSON.stringify(message.toolInvocations[0].args) ===
        JSON.stringify(lastMessage.toolInvocations[0].args)
    );
  }

  /**
   * Handles completion of a step in the LLM interaction
   * @protected
   * @param {StepResult<ToolSet>} event - Step result
   * @param {string} messageContent - Current message content
   * @param {LanguageModelUsage} tokensUsed - Token usage stats
   * @param {Function} [onStepFinish] - Optional callback for step completion
   * @returns {Promise<ReactNode | null>} Custom message element if any
   */
  protected async handleStepFinish(
    event: StepResult<ToolSet>,
    messageContent: string,
    tokensUsed: LanguageModelUsage,
    streamMessageCallback: StreamMessageCallback,
    onStepFinish?: (
      event: StepResult<ToolSet>,
      toolCallMessages: ToolCallMessage[]
    ) => Promise<void> | void
  ) {
    const { toolCalls, response, usage } = event;
    if (response.messages.length === 0) {
      this.streamMessage.parts?.push({
        type: 'text',
        text: 'Sorry, there is no response from LLM.',
      });
      return {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, there is no response from LLM.',
        toolInvocations: [],
      } as Message;
    }

    const responseMsg = response.messages[response.messages.length - 1];
    const toolCallMessages: ToolCallMessage[] = [];

    // add final message to the messages array
    const message: Message = {
      id: responseMsg.id,
      role: responseMsg.role as 'assistant',
      content: messageContent,
      toolInvocations: [],
    };

    // handle tool calls
    const functionOutput: CustomFunctionOutputProps<unknown, unknown>[] = [];

    // since we are handling the function calls, we need to save the tool results for onStepFinish callback
    const toolResults: StepResult<ToolSet>['toolResults'] = [];

    // before handling tool calls, create tool call messages
    for (const toolCall of toolCalls) {
      const toolCallMessage = {
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        args: toolCall.args,
        text: '',
        isCompleted: false,
      };
      toolCallMessages.push(toolCallMessage);
    }

    // add part
    if (toolCallMessages.length > 0) {
      this.streamMessage.parts?.push({
        type: 'tool',
        toolCallMessages,
      });
    }

    if (streamMessageCallback) {
      streamMessageCallback({
        deltaMessage: '',
        customMessage: null,
        message: this.streamMessage,
      });
    }

    // handle tool calls
    for (let i = 0; i < toolCalls.length; i++) {
      const toolCall = toolCalls[i];
      const output: CustomFunctionOutputProps<unknown, unknown> =
        await proceedToolCall({
          toolCall,
          customFunctions: VercelAi.customFunctions,
          previousOutput: functionOutput,
        });

      functionOutput.push(output);
      this.toolSteps++;

      const toolResult = {
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        args: toolCall.args,
      };

      const toolInvocation = {
        ...toolResult,
        result: output.result,
        state: 'result' as const,
        step: this.toolSteps,
      };
      message.toolInvocations?.push(toolInvocation);
      // @ts-expect-error fix type
      toolResults.push(toolInvocation);

      const toolCallMessage = {
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        args: toolCall.args,
        llmResult: output.result,
        additionalData: output.data,
        component: output.component,
        text: '',
        isCompleted: true,
      };

      // update tool call message
      toolCallMessages[i] = toolCallMessage;

      // suppose no tool call streaming
      this.streamMessage.toolCallMessages?.push(toolCallMessage);
    }

    // update last part
    if (toolCallMessages.length > 0 && this.streamMessage.parts) {
      this.streamMessage.parts[this.streamMessage.parts.length - 1] = {
        type: 'tool',
        toolCallMessages,
      };
    }

    if (streamMessageCallback) {
      streamMessageCallback({
        deltaMessage: '',
        customMessage: null,
        message: this.streamMessage,
      });
    }

    tokensUsed.promptTokens = usage?.promptTokens || 0;
    tokensUsed.completionTokens = usage?.completionTokens || 0;
    tokensUsed.totalTokens = usage?.totalTokens || 0;

    if (!this.isDuplicateToolInvocation(message)) {
      if (onStepFinish) {
        await onStepFinish({ ...event, toolResults }, toolCallMessages);
      }
    }

    // TODO: we don't return customMessage anymore, since it will be handled by 'component' at user side
    return message;
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
  }): Promise<TriggerRequestOutput> {
    if (!this.llm) {
      throw new Error(
        'LLM instance is not initialized. Please call configure() first if you want to create a client LLM instance.'
      );
    }

    // make a copy of the messages array
    const localMessages = [...this.getMessages()];

    let messageContent: string = '';
    const customMessage: ReactNode | null = null;
    const tokensUsed: LanguageModelUsage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };

    const maxSteps = VercelAiClient.maxSteps || 20;
    const messageCount = localMessages.length;

    const lastMessage = localMessages[localMessages.length - 1];

    const maxStep =
      'toolInvocations' in lastMessage
        ? extractMaxToolInvocationStep(lastMessage.toolInvocations)
        : undefined;

    const tools = VercelAiClient.tools;

    const { fullStream } = streamText({
      model: this.llm,
      messages: localMessages as
        | Array<CoreMessage>
        | Array<Omit<Message, 'id'>>,
      tools,
      toolCallStreaming: false, // TODO: disable tool call streaming for now
      toolChoice: VercelAiClient.toolChoice,
      system: VercelAiClient.instructions,
      temperature: VercelAiClient.temperature,
      ...(VercelAiClient.topP !== undefined && { topP: VercelAiClient.topP }),
      maxSteps,
      abortSignal: this.abortController?.signal,
      onStepFinish: async (event: StepResult<ToolSet>) => {
        const newMessage = await this.handleStepFinish(
          event,
          messageContent,
          tokensUsed,
          streamMessageCallback,
          onStepFinish
        );
        localMessages.push(newMessage);
      },
    });

    for await (const chunk of fullStream) {
      if (chunk.type === 'text-delta') {
        if (messageContent.length === 0) {
          // add text part at the beginning of text streaming
          this.streamMessage.parts?.push({
            type: 'text',
            text: '',
          });
        }
        // deprecated: use parts instead
        messageContent += chunk.textDelta;
        // deprecated: use parts instead
        this.streamMessage.text += chunk.textDelta;
        // find last text part
        const lastTextPart = this.streamMessage.parts?.findLast(
          (part) => part.type === 'text'
        );
        if (lastTextPart) {
          (lastTextPart as TextPart).text += chunk.textDelta;
        }
        streamMessageCallback({
          // deprecated: use parts instead
          deltaMessage: messageContent,
          customMessage,
          message: this.streamMessage,
        });
      } else if (chunk.type === 'reasoning') {
        this.streamMessage.reasoning += chunk.textDelta;
        streamMessageCallback({
          deltaMessage: messageContent,
          customMessage,
          message: this.streamMessage,
        });
      } else if (chunk.type === 'error') {
        throw new Error(`Error from Vercel AI API: ${chunk.error}`);
      }
    }

    // update messages
    this.setMessages(localMessages);

    // check after LLM response is finished
    // auto-submit when all tool calls in the last assistant message have results:
    if (
      shouldTriggerNextRequest(this.messages, messageCount, maxSteps, maxStep)
    ) {
      await this.triggerRequest({
        streamMessageCallback,
        onStepFinish,
      });
    }

    return { customMessage, tokensUsed };
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

  public override async temporaryPrompt({
    prompt,
    temperature,
  }: {
    prompt: string;
    temperature?: number;
  }): Promise<string> {
    if (!this.llm) {
      return 'LLM is not configured. Please call configure() first.';
    }
    const response = await generateText({
      model: this.llm,
      prompt,
      tools: VercelAiClient.tools,
      system: VercelAiClient.instructions,
      temperature: temperature || VercelAiClient.temperature,
      ...(VercelAiClient.topP !== undefined && { topP: VercelAiClient.topP }),
      abortSignal: this.abortController?.signal,
    });

    return response.text;
  }
}
