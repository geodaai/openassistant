import {
  AudioToTextProps,
  CustomFunctionOutputProps,
  StreamMessageCallback,
  ToolCallMessage,
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
} from 'ai';
import { Message, extractMaxToolInvocationStep } from '@ai-sdk/ui-utils';
import {
  shouldTriggerNextRequest,
  TriggerRequestOutput,
  VercelAi,
} from './vercelai';
import { convertOpenAIToolsToVercelTools } from '../lib/tool-utils';
import { tiktokenCounter } from '../utils/token-counter';
import {
  createToolCallCustomMessage,
  proceedToolCall,
} from '../utils/toolcall';

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
    this.messages = [];
    // need to reset the llm so getInstance doesn't return the same instance
    this.llm = null;
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

    const lastMessage = this.messages[this.messages.length - 1];
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
    onStepFinish?: (
      event: StepResult<ToolSet>,
      toolCallMessages: ToolCallMessage[]
    ) => Promise<void> | void
  ) {
    const { toolCalls, response, usage } = event;
    const responseMsg = response.messages[response.messages.length - 1];
    let customMessage: ReactNode | null = null;
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

    for (const toolCall of toolCalls) {
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
        result: output.result,
        state: 'result' as const,
        toolName: toolCall.toolName,
        args: toolCall.args,
        step: this.toolSteps,
      };

      message.toolInvocations?.push(toolResult);
      // @ts-expect-error fix type
      toolResults.push(toolResult);

      const toolCallMessage = createToolCallCustomMessage(
        toolCall.toolCallId,
        output
      );
      if (toolCallMessage) {
        toolCallMessages.push(toolCallMessage);
        // find toolCallMessage in the streamMessage.toolCallMessages array
        const existingToolCallMessage = this.streamMessage.toolCallMessages?.find(
          (message) => message.toolCallId === toolCall.toolCallId
        );
        if (existingToolCallMessage) {
          existingToolCallMessage.element = toolCallMessage.element;
        }
      }
    }

    if (toolCallMessages.length > 0) {
      customMessage = toolCallMessages[toolCallMessages.length - 1].element;
    }

    tokensUsed.promptTokens = usage?.promptTokens || 0;
    tokensUsed.completionTokens = usage?.completionTokens || 0;
    tokensUsed.totalTokens = usage?.totalTokens || 0;

    if (!this.isDuplicateToolInvocation(message)) {
      this.messages?.push(message);
      if (onStepFinish) {
        await onStepFinish({ ...event, toolResults }, toolCallMessages);
      }
    }

    return customMessage;
  }

  /**
   * Triggers a request to the Vercel AI API using the local LLM instance
   * @protected
   * @param {Object} params - Request parameters
   * @param {StreamMessageCallback} params.streamMessageCallback - Callback for streaming messages
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

    let messageContent: string = '';
    let customMessage: ReactNode | null = null;
    const tokensUsed: LanguageModelUsage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };

    const maxSteps = VercelAiClient.maxSteps || 4;
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
      toolCallStreaming: true,
      toolChoice: VercelAiClient.toolChoice,
      system: VercelAiClient.instructions,
      temperature: VercelAiClient.temperature,
      ...(VercelAiClient.topP !== undefined && { topP: VercelAiClient.topP }),
      maxSteps,
      abortSignal: this.abortController?.signal,
      onStepFinish: async (event: StepResult<ToolSet>) => {
        customMessage = await this.handleStepFinish(
          event,
          messageContent,
          tokensUsed,
          onStepFinish
        );
      },
    });

    for await (const chunk of fullStream) {
      if (chunk.type === 'text-delta') {
        messageContent += chunk.textDelta;
        this.streamMessage.text += chunk.textDelta;
        streamMessageCallback({
          deltaMessage: messageContent,
          customMessage,
          message: this.streamMessage,
        });
      } else if (chunk.type === 'tool-call-streaming-start') {
        const toolCallId = chunk.toolCallId;
        const toolCallMessage = this.streamMessage.toolCallMessages?.find(
          (message) => message.toolCallId === toolCallId
        );
        if (!toolCallMessage) {
          this.streamMessage.toolCallMessages?.push({
            toolCallId,
            text: '',
            reason: '',
          });
        }
      } else if (chunk.type === 'tool-call-delta') {
        const toolCallId = chunk.toolCallId;
        // find the toolCallMessage using the toolCallId
        const toolCallMessage = this.streamMessage.toolCallMessages?.find(
          (message) => message.toolCallId === toolCallId
        );
        if (toolCallMessage) {
          toolCallMessage.text += chunk.argsTextDelta;
          streamMessageCallback({
            deltaMessage: '',
            customMessage,
            message: this.streamMessage,
          });
        }
      } else if (chunk.type === 'tool-call') {
        const toolCallId = chunk.toolCallId;
        // find the toolCallMessage using the toolCallId
        const toolCallMessage = this.streamMessage.toolCallMessages?.find(
          (message) => message.toolCallId === toolCallId
        );
        if (toolCallMessage) {
          // check if 'reason' is present in the chunk.argsTextDelta and
          if (toolCallMessage.text?.includes('reason')) {
            // parse json object from the chunk.argsTextDelta
            const args = JSON.parse(toolCallMessage.text);
            if (args.reason) {
              toolCallMessage.reason = args.reason;
              toolCallMessage.text = '';
            }
            streamMessageCallback({
              deltaMessage: '',
              customMessage,
              message: this.streamMessage,
            });
          }
        }
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
