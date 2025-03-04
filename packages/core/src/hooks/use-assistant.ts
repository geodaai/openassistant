'use client';

import { useState, useEffect } from 'react';
import {
  RegisterFunctionCallingProps,
  StreamMessageCallback,
  ToolCallMessage,
  MessageModel,
} from '../types';
import { VercelAi } from '../llm/vercelai';
import { createAssistant, ExtendedTool } from '../utils/create-assistant';
import { Message, StepResult, ToolChoice } from 'ai';
import { ToolSet } from 'ai';
/**
 * Props for configuring the AI Assistant and useAssistant hook.
 *
 * @param chatEndpoint - The server endpoint for handling chat requests (e.g. '/api/chat'). Required for server-side support.
 * @param voiceEndpoint - The server endpoint for handling voice/audio requests.
 * @param name - The display name of the assistant.
 * @param modelProvider - The AI model provider service (e.g. 'openai', 'anthropic').
 * @param model - The specific model identifier to use.
 * @param apiKey - Authentication key for the model provider's API.
 * @param version - API version to use.
 * @param baseUrl - Optional base URL for API requests.
 * @param description - Optional description of the assistant's purpose.
 * @param temperature - Controls randomness in responses (0-1).
 * @param topP - Controls diversity of responses via nucleus sampling (0-1).
 * @param instructions - System instructions/prompt for the assistant.
 * @param functions - Custom functions/tools the assistant can use, either as an array or record object.
 * @param toolChoice - Controls how the assistant selects tools to use.
 * @param maxSteps - Maximum number of steps/iterations in a conversation.
 * @param abortController - Optional AbortController to cancel requests.
 */
export type UseAssistantProps = {
  chatEndpoint?: string;
  voiceEndpoint?: string;
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
  historyMessages?: Message[];
  functions?:
    | Array<RegisterFunctionCallingProps>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Record<string, ExtendedTool<any>>;
  toolChoice?: ToolChoice<ToolSet>;
  maxSteps?: number;
  abortController?: AbortController;
};

/**
 * Parameters for sending a text message to the assistant.
 *
 * @param message - The text message to send to the assistant.
 * @param streamMessageCallback - Callback function to handle streaming response chunks.
 * @param onStepFinish - Optional callback triggered when a conversation step completes.
 */
export type SendTextMessageProps = {
  message: string;
  streamMessageCallback: StreamMessageCallback;
  onStepFinish?: (
    event: StepResult<ToolSet>,
    toolCallMessages: ToolCallMessage[]
  ) => Promise<void> | void;
};

/**
 * Parameters for sending an image with optional text to the assistant.
 *
 * @param imageBase64String - Base64-encoded image data.
 * @param message - Optional text message to accompany the image.
 * @param streamMessageCallback - Callback function to handle streaming response chunks.
 */
export type SendImageMessageProps = {
  imageBase64String: string;
  message: string;
  streamMessageCallback: StreamMessageCallback;
};

let assistant: VercelAi | null = null;

/**
 * A custom hook for managing an AI assistant.
 * This hook provides functionality to initialize, send messages to, and control an AI assistant.
 *
 * @param {UseAssistantProps} props - Configuration options for the assistant.
 * @returns {Object} An object containing methods to interact with the assistant and its current status.
 */
export function useAssistant(props: UseAssistantProps) {
  /**
   * The status of the API key. Used only for client-side support.
   *
   * 'failed' - The API key is invalid.
   * 'success' - The API key is valid.
   */
  const [apiKeyStatus, setApiKeyStatus] = useState<string>('failed');

  // Add useEffect to initialize the assistant when the hook is first called
  useEffect(() => {
    initializeAssistant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  /**
   * Initializes the AI assistant with the provided configuration.
   */
  const initializeAssistant = async () => {
    try {
      if (!props.chatEndpoint && (!props.model || !props.modelProvider)) {
        throw new Error(
          'Either chatEndpoint or both model and modelProvider must be provided.'
        );
      }

      // initialize the assistant model
      assistant = await createAssistant(props);

      // restore the history messages
      if (props.historyMessages) {
        assistant.setMessages(props.historyMessages);
      }

      setApiKeyStatus('success');
    } catch (error) {
      console.error('useAssistant initialization error', error);
      setApiKeyStatus('failed');
    }
  };

  const getComponents = () => {
    return assistant?.getComponents();
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
    onStepFinish,
  }: SendTextMessageProps) => {
    await checkLLMInstance();
    await assistant?.processTextMessage({
      textMessage: message,
      streamMessageCallback,
      onStepFinish,
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
    await checkLLMInstance();
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
    await checkLLMInstance();
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

    /**
     * Returns the components for the assistant.
     */
    getComponents,
  };
}
