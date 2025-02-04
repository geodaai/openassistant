import { AbstractAssistant } from './assistant';
import {
  CustomFunctionOutputProps,
  CustomFunctions,
  ProcessMessageProps,
  RegisterFunctionCallingProps,
  StreamMessageCallback,
} from '../types';
import { ReactNode } from 'react';
import { tiktokenCounter } from '../utils/token-counter';
import { LanguageModelUsage, Message, Tool, ToolCall, ToolSet } from 'ai';
import {
  callChatApi,
  extractMaxToolInvocationStep,
  generateId,
} from '@ai-sdk/ui-utils';

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
      extractMaxToolInvocationStep(lastMessage.toolInvocations) !== maxStep) &&
    // check if the feature is enabled:
    maxSteps > 1 &&
    // check that next step is possible:
    isAssistantMessageWithCompletedToolCalls(lastMessage) &&
    // check that assistant has not answered yet:
    !lastMessage.content && // empty string or undefined
    // limit the number of automatic steps:
    (extractMaxToolInvocationStep(lastMessage.toolInvocations) ?? 0) < maxSteps
  );
}

type ConfigureProps = {
  apiKey?: string;
  model?: string;
  instructions?: string;
  temperature?: number;
  topP?: number;
  description?: string;
  version?: string;
  maxTokens?: number;
  chatEndpoint?: string;
};

export class VercelAi extends AbstractAssistant {
  protected static chatEndpoint = '';
  protected static instructions = '';
  protected static additionalContext = '';
  protected static temperature = 1.0;
  protected static topP = 0.8;
  protected static description = '';
  protected static maxTokens = 128000; // 128k tokens

  protected messages: Message[] = [];
  protected static customFunctions: CustomFunctions = {};
  protected static tools: ToolSet = {};
  protected abortController: AbortController | null = null;

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

  public static override configure(config: ConfigureProps) {
    if (!config.chatEndpoint) {
      throw new Error('chatEndpoint is required');
    }
    VercelAi.chatEndpoint = config.chatEndpoint;
    if (config.instructions) VercelAi.instructions = config.instructions;
    if (config.temperature) VercelAi.temperature = config.temperature;
    if (config.topP) VercelAi.topP = config.topP;
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
      func: callbackFunction,
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

  public override async addAdditionalContext({ context }: { context: string }) {
    VercelAi.additionalContext += context;
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

  protected async trimMessages() {
    // Avoid creating a copy if not needed
    if (await tiktokenCounter(this.messages) <= VercelAi.maxTokens) {
      return this.messages;
    }

    const updatedMessages = this.messages.slice(0);
    let totalTokens = await tiktokenCounter(updatedMessages);
    
    while (totalTokens > VercelAi.maxTokens && updatedMessages.length > 0) {
      updatedMessages.shift();
      totalTokens = await tiktokenCounter(updatedMessages);
    }
    return updatedMessages;
  }

  public override async processTextMessage({
    textMessage,
    streamMessageCallback,
  }: ProcessMessageProps) {
    if (!this.abortController) {
      this.abortController = new AbortController();
    }

    if (textMessage) {
      this.messages.push({
        id: this.messages.length.toString(),
        role: 'user',
        content: textMessage,
      });
    }

    const { customMessage } = await this.triggerRequest({
      streamMessageCallback,
    });

    const lastMessage = this.messages[this.messages.length - 1];
    streamMessageCallback({
      deltaMessage: lastMessage.content,
      customMessage,
      isCompleted: true,
    });
  }

  protected async triggerRequest({
    streamMessageCallback,
  }: {
    streamMessageCallback: StreamMessageCallback;
  }) {
    /**
     * Maximum number of sequential LLM calls (steps), e.g. when you use tool calls. Must be at least 1.
     * A maximum number is required to prevent infinite loops in the case of misconfigured tools.
     * By default, it's set to 1, which means that only a single LLM call is made.
     */
    const maxSteps = 4; // why is this 4?
    const messageCount = this.messages.length;
    const maxStep = extractMaxToolInvocationStep(
      this.messages[this.messages.length - 1]?.toolInvocations
    );

    let customMessage: ReactNode | null = null;

    // call the chat api with new message
    await callChatApi({
      api: VercelAi.chatEndpoint,
      body: {
        messages: this.messages,
        tools: VercelAi.tools,
        instructions: VercelAi.instructions,
      },
      streamProtocol: 'data',
      credentials: 'include',
      headers: {},
      fetch: undefined,
      lastMessage: this.messages[this.messages.length - 1],
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
        const result = await this.proceedToolCall({
          toolCall,
        });
        customMessage = result.customMessage;
        return JSON.stringify(result.toolResult);
      },
      onUpdate: ({ message }) => {
        if (message.role === 'assistant') {
          streamMessageCallback({
            deltaMessage: message.content,
            isCompleted: false,
          });
        }
      },
      onFinish: (
        message: Message,
        options: {
          usage: LanguageModelUsage;
        }
      ) => {
        // add the final message to the messages array
        this.messages.push(message);
        // save the usage
        console.log('usage', options.usage);
      },
    });

    if (
      shouldTriggerNextRequest(this.messages, messageCount, maxSteps, maxStep)
    ) {
      await this.triggerRequest({ streamMessageCallback });
    }

    return { customMessage };
  }

  protected async proceedToolCall({
    toolCall,
  }: {
    toolCall: ToolCall<string, unknown>;
  }) {
    // only one ToolCall allowed
    const functionOutput: CustomFunctionOutputProps<unknown, unknown>[] = [];
    let customMessage: ReactNode | null = null;

    const functionName = toolCall.toolName;
    const functionArgs = toolCall.args as Record<string, unknown>;

    try {
      // get the registered function, context and callback message
      const { func, context, callbackMessage } =
        VercelAi.customFunctions[functionName];

      // execute the function
      const output = await func({
        functionName,
        functionArgs: functionArgs,
        functionContext: context,
        previousOutput: functionOutput,
      });

      // store the output
      functionOutput.push({
        ...output,
        name: functionName,
        args: functionArgs,
        customMessageCallback: callbackMessage,
      });
    } catch (err) {
      // make sure to return something back to openai when the function execution fails
      functionOutput.push({
        type: 'errorOutput',
        name: functionName,
        args: functionArgs,
        result: {
          success: false,
          details: `The function "${functionName}" is not executed. The error message is: ${err}`,
        },
      });
    }

    // add custom reponse message from last functionOutput
    const lastOutput = functionOutput[functionOutput.length - 1];
    if (lastOutput.customMessageCallback) {
      customMessage = lastOutput.customMessageCallback({
        functionName: lastOutput.name,
        functionArgs: lastOutput.args || {},
        output: lastOutput,
      });
    }

    // return the tool result
    return { customMessage, toolResult: lastOutput.result };
  }
}
