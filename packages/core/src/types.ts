import { CoreMessage, Message, Tool, ToolSet } from 'ai';
import { StepResult } from 'ai';
import { ReactNode } from 'react';
import { z } from 'zod';

export type ToolCallComponent = {
  toolName: string;
  component?: React.ElementType | ReactNode;
};

/**
 * Type of ToolCallComponents
 *
 * A dictionary of components, key is the class name of the component, value is the React component itself.
 * The component will be used to create the tool call message.
 */
export type ToolCallComponents = ToolCallComponent[];

export type AIMessage = CoreMessage | Message;

export type VercelFunctionTool = {
  description: string;
  parameters: z.ZodType<unknown>;
  executeWithContext: CallbackFunction;
  context?: CustomFunctionContext<unknown>;
  message?: CustomMessageCallback;
};

export type VercelToolSet = Record<string, VercelFunctionTool>;

/**
 * Type of ToolCallElement. A ToolCallElement is a ReactNode element
 * that can be reconstructed by using the `type` and `config`.
 *
 *
 * @param type - The type of the tool call element, which is the name of the functional component
 * @param config - The config of the tool call element, which is the props of the functional component
 */
export type ToolCallElement = {
  type: string;
  config: Record<string, unknown>;
};

/**
 * Type of ToolCallMessage
 *
 * The tool call message is used to store the tool call information.
 *
 * @param toolCallId - The id of the tool call
 * @param toolName - The name of the tool
 * @param args - The arguments of the tool
 * @param llmResult - The result from the execution of the tool, which will be sent back to the LLM as response.
 * @param additionalData - The additional data of the tool, which can be used to pass the output of the tool to next tool call or the component for rendering.
 * @param text - The streaming text of the tool
 * @param isCompleted - The flag indicating if the tool call is completed. Note: there are three stages of the tool call:
 * 1. The tool call is requested by the LLM with the tool name and arguments.
 * 2. The tool call is executing and `{llmResult, additionalData}` will be updated.
 * 3. The tool call is completed and `{llmResult}` will be sent back to the LLM as response.
 */
export type ToolCallMessage = {
  toolName: string;
  toolCallId: string;
  args: Record<string, unknown>;
  isCompleted: boolean;
  llmResult?: unknown;
  additionalData?: unknown;
  text?: string;
};

export const ToolCallMessageSchema = z.object({
  toolName: z.string(),
  toolCallId: z.string(),
  args: z.record(z.unknown()),
  isCompleted: z.boolean(),
  llmResult: z.unknown().optional(),
  additionalData: z.unknown().optional(),
  text: z.string().optional(),
});

/**
 * Type of image message content
 */
export interface MessageImageContentProps {
  src?: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
}

/**
 * Type of message direction
 */
export type MessageDirection = 'incoming' | 'outgoing' | 0 | 1;

/**
 * Type of message type
 */
export type MessageType = 'html' | 'text' | 'image' | 'custom';

/**
 * Type of message content
 */
export type MessagePayload =
  | string
  | Record<string, unknown>
  | MessageImageContentProps
  | ReactNode;

/**
 * Type of Message model used in the chat component
 */
export type MessageModel = {
  /**
   * The message to be sent and received from the assistant.
   * @deprecated Use messageContent.text instead
   */
  message?: string;
  /**
   * The time the message was sent
   */
  sentTime?: string;
  /**
   * The sender of the message
   */
  sender?: 'user' | 'assistant' | 'error';
  /**
   * The direction of the message
   */
  direction: MessageDirection;
  /**
   * The position of the message
   */
  position: 'single' | 'first' | 'normal' | 'last' | 0 | 1 | 2 | 3;
  /**
   * The type of the message
   */
  type?: MessageType;
  /**
   * The payload of the message
   */
  payload?: MessagePayload;
  /**
   * The content of the message
   */
  messageContent?: StreamMessage;
};

/**
 * Context object for custom functions. The context object can be used to pass data from your react app to custom functions.
 * The context object (*) will be used in the following work flow:
 * 1. User sends a prompt to LLM.
 * 2. LLM calls a custom function if needed.
 * 3. The custom function will be executed using the context object e.g. get data from your react app.
 * 4. The custom function will return a result to LLM.
 * 5. The result will be sent back to the UI.
 * 6. The CustomMessageCallback will be used to create a custom message to the UI.
 *
 * @param key - The key of the context object.
 * @param value - The value of the context object.
 */
export type CustomFunctionContext<C> = {
  [key: string]: C;
};

/**
 * Custom function to get the context object.
 *
 * To support custom function execution, you can pass the context object to the custom function (see {@link CustomFunctionContext}).
 * You can also define a custom function to get the context object.
 */
export type CustomFunctionContextCallback<C> = () => CustomFunctionContext<C>;

/**
 * Properties for custom function output
 *
 * @template R - Type of the result sent back to LLM
 * @template D - Type of the data used by custom message callback
 *
 * Example:
 * ```ts
 * const customFunctionOutput: CustomFunctionOutputProps<string, string> = {
 *   type: 'custom',
 *   name: 'createMap',
 *   args: { datasetId: '123', variable: 'income' },
 * };
 * ```
 */
export type CustomFunctionOutputProps<R, D> = {
  /** Name of the function (e.g. createMap, createPlot) */
  name: string;
  /** Type of the function, used for type guarding (e.g. 'custom') */
  type?: string;
  /** Arguments passed to the function (e.g. `{datasetId: '123', variable: 'income'}`) */
  args?: Record<string, unknown>;
  /** Indicates if this is an intermediate step in a multi-step function execution */
  isIntermediate?: boolean;
  /** Result of the function execution, sent back to LLM as response */
  result: R;
  /** Additional data used by customMessageCallback to create UI elements (e.g. plot, map) */
  data?: D;
  /** @deprecated Callback function to create custom UI elements like plots or maps */
  customMessageCallback?: CustomMessageCallback;
  /** Component for the tool call */
  component?: ToolCallComponent;
};

/**
 * Type of ErrorCallbackResult
 *
 * @param success - The flag to indicate if the function execution is successful.
 * @param details - The details of the error.
 */
export type ErrorCallbackResult = {
  success: boolean;
  details: string;
};

/**
 * Props of the callback function.
 *
 * @param functionName - The name of the function.
 * @param functionArgs - The arguments of the function.
 * @param functionContext - The context of the function. See {@link CustomFunctionContext} for more details.
 * @param previousOutput - The output of the previous function.
 */
export type CallbackFunctionProps = {
  functionName: string;
  functionArgs: Record<string, unknown>;
  functionContext?:
    | CustomFunctionContext<unknown>
    | CustomFunctionContextCallback<unknown>;
  previousOutput?: CustomFunctionOutputProps<unknown, unknown>[];
};

/**
 * Callback function for custom functions. You can define your own callback function to execute custom functions.
 *
 * @param props - The props of the callback function. See {@link CallbackFunctionProps} for more details.
 * @returns The output of the custom function. See {@link CustomFunctionOutputProps} for more details.
 */
export type CallbackFunction = (
  props: CallbackFunctionProps
) =>
  | CustomFunctionOutputProps<unknown, unknown>
  | Promise<CustomFunctionOutputProps<unknown, unknown>>;

/**
 * Type of Custom functions, a dictionary of functions e.g. createMap, createPlot etc.
 * key is the name of the function, value is the function itself.
 *
 * The function should return a CustomFunctionOutputProps object, or a Promise of CustomFunctionOutputProps object if it is a async function.
 */
export type CustomFunctions = {
  [key: string]: {
    func: CallbackFunction;
    context?:
      | CustomFunctionContext<unknown>
      | CustomFunctionContextCallback<unknown>;
    component?: React.ComponentType;
    /** @deprecated Callback function to create custom UI elements like plots or maps */
    callbackMessage?: CustomMessageCallback;
    priority?: number;
  };
};

/**
 * Type of CustomFunctionCall
 *
 * @param functionName - The name of the function.
 * @param functionArgs - The arguments of the function.
 * @param output - The output of the function execution.
 */
export type CustomFunctionCall = {
  /** the name of the function */
  functionName: string;
  /** the arguments of the function */
  functionArgs?: Record<string, unknown>;
  /** the output of function execution */
  output: CustomFunctionOutputProps<unknown, unknown>;
};

/**
 * Type of CustomMessageCallback
 *
 * @param customFunctionCall The custom function call
 */
export type CustomMessageCallback = (
  customFunctionCall: CustomFunctionCall
) => ReactNode | null;

export type TextPart = {
  type: 'text';
  text: string;
};

export type ToolPart = {
  type: 'tool';
  toolCallMessages: ToolCallMessage[];
};

export type StreamMessagePart = TextPart | ToolPart;

/**
 * Type of StreamMessage. The structure of the stream message is:
 *
 * ```
 * ------------------
 * | reasoning      |
 * ------------------
 * | toolCallMessage |
 * | toolCallMessage |
 * | toolCallMessage |
 * ------------------
 * | text           |
 * ------------------
 * ```
 *
 * @param reasoning (deprecated. use parts instead) The reasoning of the assistant
 * @param toolCallMessages (deprecated. use parts instead) The array of tool call messages. See {@link ToolCallMessage} for more details.
 * @param analysis (deprecated. use parts instead) The analysis of the message. This is the text that happens before the tool calls.
 * @param text (deprecated. use parts instead) The text of the message. This is the text that happens after the tool calls.
 * @param parts The parts of the message. This is the text that happens after the tool calls.
 */
export type StreamMessage = {
  /**
   * The reasoning of the assistant
   * @deprecated Use parts instead
   */
  reasoning?: string;
  /**
   * The tool call messages
   * @deprecated Use parts instead
   */
  toolCallMessages?: ToolCallMessage[];
  /**
   * The analysis of the message
   * @deprecated Use parts instead
   */
  analysis?: string;
  /**
   * The text of the message. Normally, it is used for storing user's prompting text.
   */
  text?: string;
  /**
   * The parts of the message. It is used for storing the returning result from LLM.
   */
  parts?: StreamMessagePart[];
};

export const TextPartSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
});

export const ToolPartSchema = z.object({
  type: z.literal('tool'),
  toolCallMessages: z.array(ToolCallMessageSchema),
});

/**
 * Type of StreamMessageSchema
 *
 * @param reasoning (deprecated. use parts instead) The reasoning of the assistant
 * @param toolCallMessages (deprecated. use parts instead) The array of tool call messages. See {@link ToolCallMessage} for more details.
 * @param analysis (deprecated. use parts instead) The analysis of the message. This is the text that happens before the tool calls.
 * @param text (deprecated. use parts instead) The text of the message. This is the text that happens after the tool calls.
 * @param parts The parts of the message. This is the text that happens after the tool calls.
 */
export const StreamMessageSchema = z.object({
  reasoning: z.string().optional(),
  toolCallMessages: z.array(ToolCallMessageSchema).optional(),
  analysis: z.string().optional(),
  text: z.string().optional(),
  parts: z.array(z.union([TextPartSchema, ToolPartSchema])).optional(),
});

/**
 * Type of StreamMessageCallback
 *
 * @param message - Optional full stream message object. See {@link StreamMessage} for more details.
 * @param isCompleted - Optional flag indicating if the message stream is complete
 * @param customMessage - Optional custom message payload (e.g. screenshot base64 string)
 * @param deltaMessage - The incremental message update from the assistant
 */
export type StreamMessageCallback = (props: {
  deltaMessage: string;
  customMessage?: MessagePayload;
  isCompleted?: boolean;
  message?: StreamMessage;
}) => void;

/**
 * Type of UserActionProps
 *
 * @param role - The role of the user.
 * @param text - The text of the user action.
 */
export type UserActionProps = {
  role: string;
  text: string;
};

/**
 * Type of ProcessMessageProps
 *
 * @param textMessage - The text message to be processed.
 * @param imageMessage - The image message to be processed.
 * @param userActions - The user actions to be processed.
 * @param streamMessageCallback - The stream message callback to stream the message back to the UI.
 * @param onStepFinish - The callback function to handle the step finish.
 * @param useTool - The flag to indicate if the tool is used.
 * @param message - The message to be processed.
 */
export type ProcessMessageProps = {
  textMessage?: string;
  imageMessage?: string;
  userActions?: UserActionProps[];
  streamMessageCallback: StreamMessageCallback;
  /**
   * The callback function to handle the step finish.
   *
   * @param event The step result returned from Vercel AI SDK
   * @param toolCallMessages The tool call messages, that can be used to update the UI, see {@link ToolCallMessage}
   */
  onStepFinish?: (
    event: StepResult<ToolSet>,
    toolCallMessages: ToolCallMessage[]
  ) => Promise<void> | void;
  useTool?: boolean;
  message?: string;
};

/**
 * Type of ProcessImageMessageProps
 *
 * @param imageMessage The image message to be processed, it can be a base64 string or a URL
 * @param textMessage The text message to be processed
 * @param streamMessageCallback The stream message callback to stream the message back to the UI
 */
export type ProcessImageMessageProps = {
  imageMessage: string;
  textMessage: string;
  streamMessageCallback: StreamMessageCallback;
};

/**
 * Type of AudioToTextProps
 *
 * @param audioBlob - The audio blob to be processed. Optional.
 * @param audioBase64 - The audio base64 to be processed. Optional.
 * @param streamMessageCallback - The stream message callback to stream the message back to the UI.
 */
export type AudioToTextProps = {
  audioBlob?: Blob;
  audioBase64?: string;
  streamMessageCallback?: StreamMessageCallback;
};

/**
 * Type of RegisterToolProps
 */
export type RegisterToolProps = {
  name: string;
  tool: Tool;
  func: CallbackFunction;
  context?:
    | CustomFunctionContext<unknown>
    | CustomFunctionContextCallback<unknown>;
  component?: React.ComponentType;
};

/**
 * Type of RegisterFunctionCallingProps
 *
 * @param name - The name of the function.
 * @param description - The description of the function.
 * @param properties - The properties of the function.
 * @param required - The required properties of the function.
 * @param callbackFunction - The callback function of the function.
 * @param callbackFunctionContext - The context of the callback function.
 * @param callbackMessage - The message of the callback function.
 */
export type RegisterFunctionCallingProps = {
  name: string;
  description: string;
  properties: {
    [key: string]: {
      type: string; // 'string' | 'number' | 'boolean' | 'array';
      description: string;
      items?: {
        type: string;
      };
    };
  };
  required: string[];
  callbackFunction: CallbackFunction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callbackFunctionContext?: CustomFunctionContext<any>;
  /** @deprecated Callback function to create custom UI elements like plots or maps */
  callbackMessage?: CustomMessageCallback;
  /** Component for the tool call */
  component?: React.ComponentType;
};

/**
 * Type of OpenAIConfigProps
 *
 * @param apiKey - The API key of the OpenAI.
 * @param model - The model of the OpenAI.
 * @param temperature - The temperature of the OpenAI.
 * @param top_p - The top_p of the OpenAI.
 * @param name - The name of the OpenAI.
 * @param description - The description of the OpenAI.
 * @param instructions - The instructions of the OpenAI.
 * @param version - The version of the OpenAI.
 */
export type OpenAIConfigProps = {
  apiKey?: string;
  model?: string;
  temperature?: number;
  top_p?: number;
  name?: string;
  description?: string;
  instructions?: string;
  version?: string;
};
