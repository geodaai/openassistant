import { useState } from 'react';
import { OllamaAssistant } from '../llm/ollama';
import {
  CallbackFunction,
  CustomFunctionContext,
  CustomMessageCallback,
  StreamMessageCallback,
} from '../types';
import { GoogleAssistant } from '../llm/google';
import { OpenAIAssistant } from '../llm/openai';
import { DeepSeekAssistant } from '../llm/deepseek';

/**
 * Props for the Assistant UI and useAssistant hook.
 *
 * @param name - The name of the assistant.
 * @param modelProvider - The model provider.
 * @param model - The model.
 * @param apiKey - The API key.
 * @param version - The version.
 * @param description - The description.
 * @param temperature - The temperature.
 * @param topP - The topP.
 * @param instructions - The instructions.
 * @param functions - The functions.
 * @param functions.name - The name of the function.
 * @param functions.description - The description of the function.
 * @param functions.properties - The properties of the function.
 * @param functions.required - The required properties of the function.
 * @param functions.callbackFunction - The callback function of the function. See {@link CallbackFunction} for more details.
 * @param functions.callbackFunctionContext - The context of the callback function. See {@link CustomFunctionContext} for more details.
 * @param functions.callbackMessage - The message of the callback function. See {@link CustomMessageCallback} for more details.
 */
export type UseAssistantProps = {
  name: string;
  modelProvider: string;
  model: string;
  apiKey: string;
  version: string;
  baseUrl?: string;
  description?: string;
  temperature?: number;
  topP?: number;
  instructions: string;
  functions: {
    name: string;
    description: string;
    properties: {
      [key: string]: {
        type: string; // 'string' | 'number' | 'boolean' | 'array';
        description: string;
      };
    };
    required: string[];
    callbackFunction: CallbackFunction;
    callbackFunctionContext?: CustomFunctionContext<unknown>;
    callbackMessage?: CustomMessageCallback;
  }[];
};

/**
 * Type of SendTextMessageProps
 *
 * @param message - The message to be sent.
 * @param streamMessageCallback - The stream message callback to stream the message back to the UI. See {@link StreamMessageCallback} for more details.
 */
export type SendTextMessageProps = {
  message: string;
  streamMessageCallback: StreamMessageCallback;
};

/**
 * Type of SendImageMessageProps
 *
 * @param imageBase64String - The image base64 string to be sent.
 * @param message - The message to be sent.
 * @param streamMessageCallback - The stream message callback to stream the message back to the UI. See {@link StreamMessageCallback} for more details.
 */
export type SendImageMessageProps = {
  imageBase64String: string;
  message: string;
  streamMessageCallback: StreamMessageCallback;
};

let assistant:
  | OllamaAssistant
  | GoogleAssistant
  | OpenAIAssistant
  | DeepSeekAssistant
  | null = null;

/**
 * A custom hook for managing an AI assistant.
 * This hook provides functionality to initialize, send messages to, and control an AI assistant.
 *
 * @param {UseAssistantProps} props - Configuration options for the assistant.
 * @returns {Object} An object containing methods to interact with the assistant and its current status.
 */
export function useAssistant({
  modelProvider,
  model,
  apiKey,
  baseUrl,
  temperature,
  topP,
  instructions,
  functions,
  name,
  description,
  version,
}: UseAssistantProps) {
  /**
   * The status of the API key.
   * 'failed' - The API key is invalid.
   * 'success' - The API key is valid.
   */
  const [apiKeyStatus, setApiKeyStatus] = useState<string>('failed');

  /**
   * Initializes the AI assistant with the provided configuration.
   */
  const initializeAssistant = async () => {
    try {
      const AssistantModel = GetAssistantModelByProvider(modelProvider);

      // configure the assistant model
      AssistantModel.configure({
        model,
        apiKey,
        baseUrl,
        instructions,
        temperature,
        topP,
        name,
        description,
        version,
      });

      // register custom functions
      functions.forEach((func) => {
        AssistantModel.registerFunctionCalling({
          name: func.name,
          description: func.description,
          properties: func.properties,
          required: func.required,
          callbackFunction: func.callbackFunction,
          callbackFunctionContext: func.callbackFunctionContext,
          callbackMessage: func.callbackMessage,
        });
      });

      // initialize the assistant model
      assistant = await AssistantModel.getInstance();

      setApiKeyStatus('success');
    } catch (error) {
      console.error('useAssistant initialization error', error);
      setApiKeyStatus('failed');
    }
  };

  /**
   * Checks if the LLM instance is initialized, and initializes it if not.
   * @throws {Error} If the LLM instance fails to initialize.
   */
  const checkLLMInstance = async () => {
    if (assistant === null) {
      await initializeAssistant();
    }
    if (assistant === null) {
      throw new Error('LLM instance is not initialized');
    }
  };

  /**
   * Stops the current chat processing.
   */
  const stopChat = () => {
    if (assistant) {
      assistant.stop();
    }
  };

  /**
   * Restarts the chat by stopping the current chat and reinitializing the assistant.
   */
  const restartChat = async () => {
    if (assistant) {
      await assistant.restart();
      await initializeAssistant();
    }
  };

  /**
   * Sends a text message to the assistant and processes the response.
   * @param {SendTextMessageProps} props - The message and callback for streaming the response.
   */
  const sendTextMessage = async ({
    message,
    streamMessageCallback,
  }: SendTextMessageProps) => {
    await checkLLMInstance();
    await assistant?.processTextMessage({
      textMessage: message,
      streamMessageCallback,
    });
  };

  /**
   * Sends an image message to the assistant and processes the response.
   * @param {SendImageMessageProps} props - The image data, message, and callback for streaming the response.
   */
  const sendImageMessage = async ({
    imageBase64String,
    message,
    streamMessageCallback,
  }: SendImageMessageProps) => {
    await assistant?.processImageMessage({
      imageMessage: imageBase64String,
      textMessage: message,
      streamMessageCallback,
    });
  };

  /**
   * Converts audio to text using the assistant's capabilities.
   * @param {Blob} audioBlob - The audio data to be converted.
   * @returns {Promise<string>} The transcribed text.
   */
  const audioToText = async (audioBlob: Blob) => {
    return await assistant?.audioToText({ audioBlob });
  };

  /**
   * Adds additional context to the assistant's conversation.
   * @param {Object} params - The context and optional callback.
   */
  const addAdditionalContext = async ({ context }: { context: string }) => {
    await assistant?.addAdditionalContext({ context });
  };

  return {
    /**
     * Initializes the AI assistant with the configured settings.
     * Sets up the model, registers functions, and validates the API key.
     * @returns {Promise<void>}
     */
    initializeAssistant,

    /**
     * Sends a text message to the AI assistant and streams the response.
     * @param {SendTextMessageProps} props - Object containing the message and stream callback
     * @returns {Promise<void>}
     */
    sendTextMessage,

    /**
     * Sends an image along with text to the AI assistant and streams the response.
     * @param {SendImageMessageProps} props - Object containing the image data, message, and stream callback
     * @returns {Promise<void>}
     */
    sendImageMessage,

    /**
     * Converts an audio blob to text using the assistant's speech-to-text capabilities.
     * @param {Blob} audioBlob - The audio data to transcribe
     * @returns {Promise<string>} The transcribed text
     */
    audioToText,

    /**
     * Adds additional context to the ongoing conversation with the assistant.
     * @param {{ context: string }} params - Object containing the context to add
     * @returns {Promise<void>}
     */
    addAdditionalContext,

    /**
     * Immediately stops the current chat processing and response generation.
     * @returns {void}
     */
    stopChat,

    /**
     * Restarts the chat by stopping current processing and reinitializing the assistant.
     * @returns {Promise<void>}
     */
    restartChat,

    /**
     * Current status of the API key validation.
     * 'failed' - The API key is invalid.
     * 'success' - The API key is valid.
     * @type {'failed' | 'success'}
     */
    apiKeyStatus,
  };
}

/**
 * Returns the appropriate Assistant model based on the provider.
 * @param {string} provider - The name of the AI provider.
 * @returns {typeof OllamaAssistant | typeof GoogleAssistant | typeof GPTAssistant} The assistant model class.
 */
function GetAssistantModelByProvider(provider: string) {
  switch (provider.toLowerCase()) {
    case 'openai':
      return OpenAIAssistant;
    case 'google':
      return GoogleAssistant;
    case 'ollama':
      return OllamaAssistant;
    case 'deepseek':
      return DeepSeekAssistant;
    default:
      return OpenAIAssistant;
  }
}
