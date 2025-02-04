import { ReactNode } from 'react';

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
 * Type of Message model
 *
 * @param message The message to be sent
 * @param sentTime The time the message was sent
 * @param sender The sender of the message
 * @param direction The direction of the message
 * @param position The position of the message
 * @param type The type of the message
 * @param payload The payload of the message, can be string, object, image or custom
 */
export interface MessageModel {
  message?: string;
  sentTime?: string;
  sender?: string;
  direction: MessageDirection;
  position: 'single' | 'first' | 'normal' | 'last' | 0 | 1 | 2 | 3;
  type?: MessageType;
  payload?: MessagePayload;
}

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
 * Type of Custom function output props
 * 
 * @template R The type of the result send back to LLM
 * @template D The type of the data used by custom message callback
 * @param type The type of the function, e.g. 'custom' used for type guarding
 * @param name The name of the function, e.g. createMap, createPlot etc.
 * @param args The args of the function, e.g. {datasetId: '123', variable: 'income'}
 * @param isIntermediate The flag indicate if the custom function is a intermediate step
 * @param result The result of the function run, it will be sent back to LLM as response of function calling
 * @param data The data of the function run, it will be used by customMessageCallback() to create the custom message e.g. plot, map etc.
 * @param customMessageCallback The callback function to create custom message e.g. plot/map if needed
 */
export type CustomFunctionOutputProps<R, D> = {
  type: string;
  name: string;
  args?: Record<string, unknown>;
  isIntermediate?: boolean;
  result: R;
  data?: D;
  customMessageCallback?: CustomMessageCallback;
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
  functionContext?: CustomFunctionContext<unknown> | CustomFunctionContextCallback<unknown>;
  previousOutput?: CustomFunctionOutputProps<unknown, unknown>[];
};

/**
 * Callback function for custom functions. You can define your own callback function to execute custom functions.
 * 
 * @param props - The props of the callback function. See {@link CallbackFunctionProps} for more details.
 * @returns The output of the custom function. See {@link CustomFunctionOutputProps} for more details.
 */
export type CallbackFunction = (props: CallbackFunctionProps) =>
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
    context?: CustomFunctionContext<unknown> | CustomFunctionContextCallback<unknown>;
    callbackMessage?: CustomMessageCallback;
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
  functionArgs: Record<string, unknown>;
  /** the output of function execution */
  output: CustomFunctionOutputProps<unknown, unknown>
};

/**
 * Type of CustomMessageCallback
 *
 * @param customFunctionCall The custom function call
 */
export type CustomMessageCallback = (
  customFunctionCall: CustomFunctionCall
) => ReactNode | null;

/**
 * Type of StreamMessageCallback
 *
 * @param deltaMessage The delta message from the assistant
 * @param customMessage The custom message from the custom function
 * @param isCompleted The flag to indicate if the message is completed
 */
export type StreamMessageCallback = (props: {
  deltaMessage: string;
  customMessage?: MessagePayload;
  isCompleted?: boolean;
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
 * @param useTool - The flag to indicate if the tool is used.
 * @param message - The message to be processed.
 */
export type ProcessMessageProps = {
  textMessage?: string;
  imageMessage?: string;
  userActions?: UserActionProps[];
  streamMessageCallback: StreamMessageCallback;
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
  callbackMessage?: CustomMessageCallback;
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
