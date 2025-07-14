// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  FileUIPart,
  ReasoningUIPart,
  SourceUIPart,
  StepStartUIPart,
  TextUIPart,
  ToolInvocationUIPart,
} from '@ai-sdk/ui-utils';
import { CoreMessage, Message, Tool } from 'ai';
import { ReactNode } from 'react';
import { z } from 'zod';

export type ToolCallComponent = {
  toolName: string;
  component?: unknown;
};

export type ToolCallComponents = ToolCallComponent[];

export type AIMessage = CoreMessage | Message;

/**
 * The tool call message is used to store the tool call information.
 */
export type ToolCallMessage = {
  toolName: string;
  toolCallId: string;
  toolOutput: unknown;
  args: Record<string, unknown>;
  isCompleted: boolean;
  text?: string;
};

export const ToolCallMessageSchema = z.object({
  toolName: z.string(),
  toolCallId: z.string(),
  toolOutput: z.unknown(),
  args: z.record(z.unknown()),
  isCompleted: z.boolean(),
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

export type Part =
  | TextUIPart
  | ReasoningUIPart
  | ToolInvocationUIPart
  | SourceUIPart
  | FileUIPart
  | StepStartUIPart;

export type StreamMessagePart = Part & {
  additionalData?: unknown;
  isCompleted?: boolean;
};

/**
 * Type of StreamMessage. The structure of the stream message is:
 *
 * @param parts The parts of the message. This is the text that happens after the tool calls.
 */
export type StreamMessage = {
  /**
   * The parts of the message. It is used for storing the returning result from LLM.
   */
  parts?: Array<StreamMessagePart>;
};

export const StreamMessagePartSchema = z.union([
  z.object({
    type: z.literal('text'),
    text: z.string(),
    additionalData: z.any().optional(),
    isCompleted: z.boolean().optional(),
  }),
  z.object({
    type: z.literal('tool-invocation'),
    toolInvocation: z.object({
      toolCallId: z.string(),
      toolName: z.string(),
      args: z.any(),
      state: z.string(),
      result: z.any().optional(),
    }),
    additionalData: z.any().optional(),
    isCompleted: z.boolean().optional(),
  }),
  // Add a catch-all for other part types that might exist
  z
    .object({
      type: z.string(),
      additionalData: z.any().optional(),
      isCompleted: z.boolean().optional(),
    })
    .passthrough(),
]);

/**
 * Type of StreamMessageSchema
 *
 * @param parts The parts of the message. This is the text that happens after the tool calls.
 */
export const StreamMessageSchema = z.object({
  parts: z.array(StreamMessagePartSchema).optional(),
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
  onToolFinished?: (toolCallId: string, additionalData: unknown) => void;
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
  component?: unknown;
};
