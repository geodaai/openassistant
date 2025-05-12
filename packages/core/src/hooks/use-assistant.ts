'use client';

import { useState, useEffect } from 'react';
import { StreamMessageCallback, ToolCallMessage } from '../types';
import { VercelAi } from '../llm/vercelai';
import { createAssistant } from '../utils/create-assistant';
import { convertToCoreMessages, Message, StepResult, ToolChoice, ToolSet } from 'ai';
import { ExtendedTool } from '@openassistant/utils';

/**
 * Props for configuring the AI Assistant and useAssistant hook.
 */
export type UseAssistantProps = {
  /** The server endpoint for handling chat requests (e.g. '/api/chat'). Required for server-side support. */
  chatEndpoint?: string;
  /** The server endpoint for handling voice/audio requests. */
  voiceEndpoint?: string;
  /** The display name of the assistant. */
  name: string;
  /**
   * The AI model provider:
   *
   * - openai
   * - anthropic
   * - google
   * - deepseek
   * - xai
   * - ollama
   *
   */
  modelProvider: string;
  /** The specific model identifier to use:
   *
   * - openai [models](https://sdk.vercel.ai/providers/ai-sdk-providers/openai#model-capabilities)
   * - anthropic [models](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#model-capabilities)
   * - google [models](https://sdk.vercel.ai/providers/ai-sdk-providers/google#model-capabilities)
   * - deepseek [models](https://sdk.vercel.ai/providers/ai-sdk-providers/deepseek#model-capabilities)
   * - xai [models](https://sdk.vercel.ai/providers/ai-sdk-providers/xai#model-capabilities)
   * - ollama [models](https://ollama.com/models)
   */
  model: string;
  /** The authentication key/token for the model provider's API. For example, [how to get the OpenAI API key](https://platform.openai.com/api-keys). */
  apiKey: string;
  /** Optional API version to use. */
  version?: string;
  /** Optional base URL for API requests. */
  baseUrl?: string;
  /** Optional description of the assistant's purpose. */
  description?: string;
  /** Controls randomness in responses (0-1). */
  temperature?: number;
  /** Controls diversity of responses via nucleus sampling (0-1). */
  topP?: number;
  /** System instructions/prompt for the assistant. */
  instructions: string;
  /** The history of messages exchanged with the assistant. */
  historyMessages?: Message[];
  /** Custom tools the assistant can use. E.g. `{ localQuery: localQueryTool }` */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools?: Record<string, ExtendedTool<any, any, any, any>>;
  /** Controls how the assistant selects tools to use. */
  toolChoice?: ToolChoice<ToolSet>;
  /** Maximum number of steps/iterations in a conversation. */
  maxSteps?: number;
  /** Whether to stream tool calls. */
  toolCallStreaming?: boolean;
  /** Optional AbortController to cancel requests. */
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
  }, [props.model, props.apiKey, props.chatEndpoint, props.instructions]);

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
      if (props.historyMessages && props.historyMessages.length > 0) {
        assistant.setMessages(convertToCoreMessages(props.historyMessages));
      }

      // set the abort controller
      if (props.abortController) {
        assistant.setAbortController(props.abortController);
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
