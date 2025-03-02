import { AbstractAssistant } from './assistant';
import {
  AudioToTextProps,
  CustomFunctionOutputProps,
  CustomFunctions,
  ProcessImageMessageProps,
  ProcessMessageProps,
  RegisterFunctionCallingProps,
  StreamMessage,
  StreamMessageCallback,
  ToolCallMessage,
} from '../types';
import { ReactNode } from 'react';
import {
  LanguageModelUsage,
  StepResult,
  Tool,
  ToolCall,
  ToolChoice,
  ToolSet,
} from 'ai';
import {
  Message,
  UIMessage,
  callChatApi,
  extractMaxToolInvocationStep,
  generateId,
} from '@ai-sdk/ui-utils';
import { proceedToolCall } from '../utils/toolcall';

/**
Check if the message is an assistant message with completed tool calls.
The message must have at least one tool invocation and all tool invocations
must have a result.
 */
export function isAssistantMessageWithCompletedToolCalls(message: Message) {
  return (
    message.role === 'assistant' &&
    message.toolInvocations &&
    message.toolInvocations.length > 0 &&
    message.toolInvocations.every(
      (toolInvocation) => 'result' in toolInvocation
    )
  );
}

export type TriggerRequestOutput = {
  customMessage: ReactNode | null;
  outputToolResults?: StepResult<ToolSet>['toolResults'][];
  outputToolCalls?: ToolCall<string, unknown>[];
  tokensUsed?: LanguageModelUsage;
};

/**
 * Checks if another request should be triggered based on the current message state
 * @param messages Current message array
 * @param messageCount Previous message count before last request
 * @param maxSteps Maximum number of allowed steps
 * @param maxStep Current maximum tool invocation step
 * @returns boolean indicating if another request should be triggered
 */
export function shouldTriggerNextRequest(
  messages: Message[],
  messageCount: number,
  maxSteps: number,
  maxStep: number | undefined
): boolean {
  const lastMessage = messages[messages.length - 1];
  return Boolean(
    // ensure there is a last message:
    lastMessage &&
      // ensure we actually have new messages (to prevent infinite loops in case of errors):
      (messages.length > messageCount ||
        extractMaxToolInvocationStep(lastMessage.toolInvocations) !==
          maxStep) &&
      // check if the feature is enabled:
      maxSteps > 1 &&
      // check that next step is possible:
      isAssistantMessageWithCompletedToolCalls(lastMessage) &&
      // check that assistant has not answered yet:
      !lastMessage.content && // empty string or undefined
      // limit the number of automatic steps:
      (extractMaxToolInvocationStep(lastMessage.toolInvocations) ?? 0) <
        maxSteps
  );
}

type VercelAiConfigureProps = {
  apiKey?: string;
  model?: string;
  instructions?: string;
  temperature?: number;
  topP?: number;
  description?: string;
  version?: string;
  maxTokens?: number;
  chatEndpoint?: string;
  voiceEndpoint?: string;
  toolChoice?: ToolChoice<ToolSet>;
};

/**
 * Vercel AI Assistant for Server only.
 */
export class VercelAi extends AbstractAssistant {
  protected static chatEndpoint = '';
  protected static voiceEndpoint = '';
  protected static instructions = '';
  protected static toolChoice: ToolChoice<ToolSet> = 'auto';
  protected static maxSteps = 4;
  protected static additionalContext = '';
  protected static temperature = 0.0;
  protected static topP: number | undefined = undefined;
  protected static description = '';
  protected static maxTokens = 128000; // 128k tokens
  protected static hasInitializedServer = false;

  protected toolSteps = 0;

  protected messages: Message[] = [];
  protected static customFunctions: CustomFunctions = {};
  protected static tools: ToolSet = {};
  protected abortController: AbortController | null = null;

  protected static instance: VercelAi | null = null;

  protected streamMessage: StreamMessage = {
    toolCallMessages: [],
    text: '',
  };

  protected constructor() {
    super();
  }

  public static async getInstance() {
    // this is a singleton class, and it is only for server side use
    // in which case we don't create a specific llm (LanguageModel)
    // and the server side will create the llm instance
    if (!VercelAi.instance) {
      VercelAi.instance = new VercelAi();
    }
    return VercelAi.instance;
  }

  public static override configure(config: VercelAiConfigureProps) {
    if (!config.chatEndpoint) {
      throw new Error('chatEndpoint is required');
    }
    VercelAi.chatEndpoint = config.chatEndpoint;
    if (config.voiceEndpoint) VercelAi.voiceEndpoint = config.voiceEndpoint;
    if (config.instructions) VercelAi.instructions = config.instructions;
    if (config.temperature !== undefined)
      VercelAi.temperature = config.temperature;
    if (config.topP !== undefined) VercelAi.topP = config.topP;
    if (config.description) VercelAi.description = config.description;
    if (config.maxTokens) VercelAi.maxTokens = config.maxTokens;
  }

  public static override registerFunctionCalling({
    name,
    description,
    properties,
    required,
    callbackFunction,
    callbackFunctionContext,
    callbackMessage,
  }: RegisterFunctionCallingProps) {
    // register custom function, if already registed then rewrite it
    VercelAi.customFunctions[name] = {
      func: callbackFunction || (() => Promise.resolve({ name, result: {} })),
      context: callbackFunctionContext,
      callbackMessage,
    };

    // add function calling to tools
    const tool: Tool = {
      type: 'function',
      description,
      parameters: {
        type: 'object',
        properties,
        required,
      },
    };

    VercelAi.tools[name] = tool;
  }

  public getMessages() {
    return this.messages;
  }

  public setMessages(messages: Message[]) {
    this.messages = messages;
  }

  public override async addAdditionalContext({ context }: { context: string }) {
    VercelAi.additionalContext += context;
  }

  public setAbortController(abortController: AbortController) {
    this.abortController = abortController;
  }

  public override stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  public override restart() {
    this.stop();
    this.messages = [];
  }

  public static getBaseURL() {
    throw new Error(
      'No base URL for VercelAi. It is a server-side only class.'
    );
  }

  public override async processImageMessage({
    imageMessage,
    textMessage,
    streamMessageCallback,
  }: ProcessImageMessageProps): Promise<void> {
    await this.processTextMessage({
      textMessage,
      streamMessageCallback,
      imageMessage,
    });
  }

  public override async processTextMessage({
    textMessage,
    streamMessageCallback,
    imageMessage,
    onStepFinish,
  }: ProcessMessageProps) {
    if (!this.abortController) {
      this.abortController = new AbortController();
    }

    if (textMessage) {
      this.messages.push({
        id: generateId(),
        role: 'user',
        content: textMessage,
        parts: [{ type: 'text', text: textMessage }],
      });
    }

    // reset tool steps
    this.toolSteps = 0;

    // reset stream message
    this.streamMessage = {
      reasoning: '',
      toolCallMessages: [],
      text: '',
    };

    const { customMessage, outputToolResults, outputToolCalls } =
      await this.triggerRequest({
        streamMessageCallback,
        imageMessage,
        onStepFinish,
      });

    const lastMessage = this.messages[this.messages.length - 1];
    streamMessageCallback({
      deltaMessage: lastMessage.content,
      customMessage,
      isCompleted: true,
      message: this.streamMessage,
    });

    return { messages: [lastMessage], outputToolResults, outputToolCalls };
  }

  protected async triggerRequest({
    streamMessageCallback,
    imageMessage,
  }: {
    streamMessageCallback: StreamMessageCallback;
    imageMessage?: string;
    onStepFinish?: (
      event: StepResult<ToolSet>,
      toolCallMessages: ToolCallMessage[]
    ) => Promise<void> | void;
  }): Promise<TriggerRequestOutput> {
    /**
     * Maximum number of sequential LLM calls (steps), e.g. when you use tool calls. Must be at least 1.
     * A maximum number is required to prevent infinite loops in the case of misconfigured tools.
     * By default, it's set to 1, which means that only a single LLM call is made.
     */
    const maxSteps = VercelAi.maxSteps;
    const messageCount = this.messages.length;
    const maxStep = extractMaxToolInvocationStep(
      this.messages[this.messages.length - 1]?.toolInvocations
    );

    let customMessage: ReactNode | null = null;
    const lastMessage = this.messages[this.messages.length - 1];

    // call the chat api with new message
    await callChatApi({
      api: VercelAi.chatEndpoint,
      body: {
        // only send the last message
        message: lastMessage,
        // attach image with text message if provided
        ...(imageMessage ? { imageBase64: imageMessage } : {}),
        // Only send tools and instructions on first request
        ...(VercelAi.hasInitializedServer
          ? {}
          : {
              tools: VercelAi.tools,
              instructions: VercelAi.instructions,
            }),
      },
      streamProtocol: 'data',
      credentials: 'include',
      headers: {},
      fetch: undefined,
      lastMessage: lastMessage as UIMessage,
      generateId: () => generateId(),
      abortController: () => this.abortController,
      restoreMessagesOnFailure: () => {},
      // processDataStream onResponse if needed
      onResponse: () => {},
      // processToolCall if needed
      onToolCall: async ({
        toolCall,
      }: {
        toolCall: ToolCall<string, unknown>;
      }) => {
        const output: CustomFunctionOutputProps<unknown, unknown> =
          await proceedToolCall({
            toolCall,
            customFunctions: VercelAi.customFunctions,
          });
        if (output.customMessageCallback) {
          try {
            customMessage = output.customMessageCallback({
              functionName: output.name,
              functionArgs: output.args || {},
              output: output,
            });
          } catch (error) {
            console.error(
              `Error creating custom message for tool call ${toolCall.toolCallId}: ${error}`
            );
          }
        }
        return JSON.stringify(output.result);
      },
      onUpdate: ({ message }) => {
        if (message.role === 'assistant') {
          streamMessageCallback({
            deltaMessage: message.content,
            isCompleted: false,
          });
        }
      },
      onFinish: (message: Message) => {
        // Mark server as initialized after first request
        VercelAi.hasInitializedServer = true;
        // add the final message to the messages array
        this.messages.push(message);
      },
    });

    if (
      shouldTriggerNextRequest(this.messages, messageCount, maxSteps, maxStep)
    ) {
      await this.triggerRequest({ streamMessageCallback });
    }

    return { customMessage };
  }

  /**
   * audioToText method to use API endpoint for audio transcription
   * @param audioBlob - The audio blob to transcribe
   * @returns The transcribed text
   */
  public override async audioToText({
    audioBlob,
  }: AudioToTextProps): Promise<string> {
    if (!audioBlob) {
      throw new Error('audioBlob is null');
    }
    if (!this.abortController) {
      this.abortController = new AbortController();
    }
    if (!VercelAi.voiceEndpoint || VercelAi.voiceEndpoint === '') {
      throw new Error('voiceEndpoint is not set');
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    // formData.append('model', 'whisper-1');

    const response = await fetch(VercelAi.voiceEndpoint, {
      method: 'POST',
      body: formData,
    });

    // get response text from server (non-streaming)
    const text = await response.text();

    //  parse the text to get the transcription
    const transcription = JSON.parse(text).transcript;
    return transcription;
  }
}
