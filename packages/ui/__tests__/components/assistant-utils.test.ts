// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  sendTextMessageHandler,
  sendImageMessageHandler,
} from '../../src/components/assistant-utils';
import { MessageModel } from '@openassistant/core';

describe('assistant-utils', () => {
  let mockSetMessages: jest.Mock;
  let mockSetTypingIndicator: jest.Mock;
  let mockSendTextMessage: jest.Mock;
  let mockSendImageMessage: jest.Mock;
  let mockOnMessagesUpdated: jest.Mock;

  beforeEach(() => {
    mockSetMessages = jest.fn();
    mockSetTypingIndicator = jest.fn();
    mockSendTextMessage = jest.fn();
    mockSendImageMessage = jest.fn();
    mockOnMessagesUpdated = jest.fn();
  });

  describe('sendTextMessageHandler', () => {
    it('should handle successful text message sending', async () => {
      const initialMessages: MessageModel[] = [];
      const newMessage = 'Hello, AI!';

      mockSendTextMessage.mockImplementation(({ streamMessageCallback }) => {
        streamMessageCallback({
          deltaMessage: 'AI response',
          isCompleted: true,
        });
      });

      await sendTextMessageHandler({
        newMessage,
        messages: initialMessages,
        setMessages: mockSetMessages,
        setTypingIndicator: mockSetTypingIndicator,
        sendTextMessage: mockSendTextMessage,
        onMessagesUpdated: mockOnMessagesUpdated,
      });

      expect(mockSetTypingIndicator).toHaveBeenCalledWith(true);
      expect(mockSetTypingIndicator).toHaveBeenCalledWith(false);
      expect(mockSetMessages).toHaveBeenCalledTimes(2);
      expect(mockOnMessagesUpdated).toHaveBeenCalled();
    });

    it('should handle error during text message sending', async () => {
      const initialMessages: MessageModel[] = [];
      const newMessage = 'Hello, AI!';
      const errorMessage = 'API Error';

      mockSendTextMessage.mockRejectedValue(new Error(errorMessage));

      await sendTextMessageHandler({
        newMessage,
        messages: initialMessages,
        setMessages: mockSetMessages,
        setTypingIndicator: mockSetTypingIndicator,
        sendTextMessage: mockSendTextMessage,
        onMessagesUpdated: mockOnMessagesUpdated,
      });

      expect(mockSetTypingIndicator).toHaveBeenCalledWith(false);
      expect(mockSetMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining(errorMessage),
            sender: 'Error',
          }),
        ])
      );
      expect(mockOnMessagesUpdated).toHaveBeenCalled();
    });
  });

  describe('sendImageMessageHandler', () => {
    it('should handle successful image message sending', async () => {
      const initialMessages: MessageModel[] = [];
      const newMessage = 'Analyze this image';
      const imageBase64String = 'base64encodedimage';

      mockSendImageMessage.mockImplementation(({ streamMessageCallback }) => {
        streamMessageCallback({
          deltaMessage: 'Image analysis result',
          isCompleted: true,
        });
      });

      await sendImageMessageHandler({
        newMessage,
        imageBase64String,
        messages: initialMessages,
        setMessages: mockSetMessages,
        setTypingIndicator: mockSetTypingIndicator,
        sendImageMessage: mockSendImageMessage,
        onMessagesUpdated: mockOnMessagesUpdated,
      });

      expect(mockSetTypingIndicator).toHaveBeenCalledWith(true);
      expect(mockSetTypingIndicator).toHaveBeenCalledWith(false);
      expect(mockSetMessages).toHaveBeenCalledTimes(2);
      expect(mockOnMessagesUpdated).toHaveBeenCalled();
    });

    it('should handle error during image message sending', async () => {
      const initialMessages: MessageModel[] = [];
      const newMessage = 'Analyze this image';
      const imageBase64String = 'base64encodedimage';
      const errorMessage = 'Image processing error';

      mockSendImageMessage.mockRejectedValue(new Error(errorMessage));

      await sendImageMessageHandler({
        newMessage,
        imageBase64String,
        messages: initialMessages,
        setMessages: mockSetMessages,
        setTypingIndicator: mockSetTypingIndicator,
        sendImageMessage: mockSendImageMessage,
        onMessagesUpdated: mockOnMessagesUpdated,
      });

      expect(mockSetTypingIndicator).toHaveBeenCalledWith(false);
      expect(mockSetMessages).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining(errorMessage),
            sender: 'Error',
          }),
        ])
      );
      expect(mockOnMessagesUpdated).toHaveBeenCalled();
    });
  });
});
