// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { AbstractAssistant } from './assistant';
import {
  AudioToTextProps,
  ProcessImageMessageProps,
  ProcessMessageProps,
  RegisterToolProps,
  StreamMessage,
  StreamMessageCallback,
  ToolCallComponents,
} from '../types';
import {
  CoreMessage,
  CoreToolMessage,
  CoreUserMessage,
  ToolCall,
  ToolChoice,
  ToolSet,
  convertToCoreMessages,
} from 'ai';
import {
  Message,
  ToolInvocation,
  UIMessage,
  callChatApi,
  generateId,
} from '@ai-sdk/ui-utils';
import { executeToolCall } from '../utils/toolcall';

export function extractMaxToolInvocationStep(
  toolInvocations: ToolInvocation[] | undefined
): number | undefined {
  return toolInvocations?.reduce((max, toolInvocation) => {
    return Math.max(max, toolInvocation.step ?? 0);
  }, 0);
}

/**
Check if the message is an assistant message with completed tool calls.
The message must have at least one tool invocation and all tool invocations
must have a result.
 */
export function isAssistantMessageWithCompletedToolCalls(message: CoreMessage) {
  // check message is a CoreToolMessage since it always comes with a pair: CoreAssistantMessage and CoreToolMessage
  if (message.role === 'tool') {
    const toolMessage = message as CoreToolMessage;
    // check if the tool message has a result
    return toolMessage.content.length > 0;
  }
  return false;
}

/**
 * Checks if another request should be triggered based on the current message state
 * @param messages Current message array
 * @param messageCount Previous message count before last request
 * @param maxSteps Maximum number of allowed steps
 * @param currentStep Current maximum tool invocation step
 * @returns boolean indicating if another request should be triggered
 */
export function shouldTriggerNextRequest(
  messages: CoreMessage[],
  messageCount: number,
  maxSteps: number,
  currentStep: number
): boolean {
  const lastMessage = messages[messages.length - 1];

  return Boolean(
    // ensure there is a last message:
    Boolean(lastMessage) &&
      // ensure we actually have new messages (to prevent infinite loops in case of errors):
      messages.length > messageCount &&
      // check if the feature is enabled:
      maxSteps > 1 &&
      // check that next step is possible:
      isAssistantMessageWithCompletedToolCalls(lastMessage) &&
      // check that assistant has not answered yet:
      // note: analysis text + tool calls + answer text
      // Boolean(lastMessage.content) && // empty string or undefined
      // limit the number of automatic steps:
      currentStep < maxSteps
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
  toolCallStreaming?: boolean;
  headers?: Record<string, string>;
};

/**
 * Vercel AI Assistant for Server only.
 */
export class VercelAi extends AbstractAssistant {
  protected static chatEndpoint = '';
  protected static voiceEndpoint = '';
  protected static instructions = '';
  protected static toolChoice: ToolChoice<ToolSet> = 'auto';
  protected static toolCallStreaming = false;
  protected static maxSteps = 20;
  protected static additionalContext = '';
  protected static temperature = 0.0;
  protected static topP: number | undefined = undefined;
  protected static description = '';
  protected static maxTokens = 128000; // 128k tokens
  protected static hasInitializedServer = false;
  protected static headers: Record<string, string> = {};

  // used by each processTextMessage call
  protected toolSteps = 0;

  // used by each processTextMessage call
  protected streamMessage: StreamMessage = {
    parts: [],
  };

  /**
   * The messages array, which is used to send to the LLM.
   *
   * To persist the messages, you can call the {@link setMessages} method, and  the {@link getMessages} method.
   */
  protected messages: CoreMessage[] = [];

  protected abortController: AbortController | null = null;

  protected static tools: ToolSet = {};

  protected static toolComponent: Record<string, unknown> = {};

  protected static toolResults: Record<string, unknown> = {};

  protected static instance: VercelAi | null = null;

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
    if (config.toolCallStreaming !== undefined)
      VercelAi.toolCallStreaming = config.toolCallStreaming;
    if (config.headers) VercelAi.headers = config.headers;
  }

  public static override registerTool({
    name,
    tool,
    component,
  }: RegisterToolProps) {
    VercelAi.tools[name] = tool;
    VercelAi.toolComponent[name] = component;
  }

  public static addToolResult(toolCallId: string, additionalData: unknown) {
    VercelAi.toolResults[toolCallId] = additionalData;
  }

  public static getToolResult(toolCallId: string) {
    return VercelAi.toolResults[toolCallId];
  }

  public getMessages() {
    return this.messages;
  }

  public addMessage(message: CoreMessage) {
    this.messages.push(message);
  }

  public setMessages(messages: CoreMessage[]) {
    this.messages = messages;
  }

  public getComponents(): ToolCallComponents {
    const components: ToolCallComponents = [];

    Object.keys(VercelAi.toolComponent).forEach((key) => {
      const component = VercelAi.toolComponent[key];
      if (component) {
        components.push({
          toolName: key,
          component,
        });
      }
    });

    return components;
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
    onToolFinished,
  }: ProcessMessageProps) {
    if (!this.abortController) {
      this.abortController = new AbortController();
    }

    // record the length of the messages array before adding new messages
    const messagesLength = this.messages.length;

    // adding the user message to the messages array
    if (!imageMessage && textMessage) {
      const newMessage: CoreUserMessage = {
        role: 'user',
        content: textMessage,
      };
      this.messages.push(newMessage);
    } else if (imageMessage && textMessage) {
      const newMessage: CoreMessage = {
        role: 'user',
        content: [
          { type: 'text', text: textMessage },
          { type: 'image', image: imageMessage },
        ],
      };
      this.messages.push(newMessage);
    }

    // reset tool steps, which represents how many steps have been made for this message request
    this.toolSteps = 0;

    // reset stream message
    this.streamMessage = {
      parts: [],
    };

    // call LLM with the new message
    await this.triggerRequest({
      streamMessageCallback,
      onToolFinished,
    });

    // complete the stream message
    const lastMessage = this.messages[this.messages.length - 1];
    streamMessageCallback({
      deltaMessage: lastMessage.content as string,
      isCompleted: true,
      message: this.streamMessage,
    });

    // return the newly added message, could be more than one
    const newMessages = this.messages.slice(messagesLength);
    return { streamMessage: this.streamMessage, messages: newMessages };
  }

  protected async triggerRequest({
    streamMessageCallback,
    imageMessage,
    onToolFinished,
  }: {
    streamMessageCallback: StreamMessageCallback;
    imageMessage?: string;
    onToolFinished?: (toolCallId: string, additionalData: unknown) => void;
  }) {
    /**
     * Maximum number of sequential LLM calls (steps), e.g. when you use tool calls. Must be at least 1.
     * A maximum number is required to prevent infinite loops in the case of misconfigured tools.
     * By default, it's set to 1, which means that only a single LLM call is made.
     */
    const maxSteps = VercelAi.maxSteps;
    const messageCount = this.messages.length;

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
      headers: VercelAi.headers,
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
        const output = await executeToolCall(
          toolCall,
          VercelAi.tools,
          this.messages as CoreMessage[],
          this.abortController?.signal
        );
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
        this.messages.push(...convertToCoreMessages([message]));
      },
    });

    if (
      shouldTriggerNextRequest(
        this.messages,
        messageCount,
        maxSteps,
        this.toolSteps
      )
    ) {
      await this.triggerRequest({ streamMessageCallback, onToolFinished });
    }

    return {};
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
