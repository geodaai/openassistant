// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * @jest-environment jsdom
 */
import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AiAssistant } from '../../src/components/assistant';
import { useAssistant, UseAssistantProps } from '@openassistant/core';

// Add this at the top of the file, after the imports
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock the useAssistant hook
jest.mock('@openassistant/core', () => ({
  useAssistant: jest.fn(),
}));

describe('AiAssistant', () => {
  const mockUseAssistant = {
    stopChat: jest.fn(),
    restartChat: jest.fn(),
    sendTextMessage: jest.fn(),
    sendImageMessage: jest.fn(),
    audioToText: jest.fn(),
  };

  const mockProps: UseAssistantProps = {
    name: 'test-name',
    version: 'test-version',
    modelProvider: 'openai',
    model: 'gpt-3.5-turbo',
    apiKey: 'test-api-key',
    instructions: 'Test instructions',
    functions: [],
  };

  beforeEach(() => {
    (useAssistant as jest.Mock).mockReturnValue(mockUseAssistant);
  });

  it('renders welcome message', () => {
    render(
      <AiAssistant
        {...mockProps}
        welcomeMessage="Welcome to the AI Assistant!"
      />
    );
    expect(
      screen.getByText('Welcome to the AI Assistant!')
    ).toBeInTheDocument();

    // check the avatar should be the default one gravity-ui:face-robot
    const messageCard = screen.getByTestId('message-card');
    // find aria-label="avatar" in the message card
    const avatar = messageCard.querySelector('[aria-label="avatar"]');
    expect(avatar).toBeInTheDocument();
  });

  it('sends a text message', async () => {
    render(<AiAssistant {...mockProps} welcomeMessage="Welcome" />);

    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Hello, AI!' } });
    });

    const sendButton = screen.getByTestId('send-button');
    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(mockUseAssistant.sendTextMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Hello, AI!',
          streamMessageCallback: expect.any(Function),
        })
      );
    });

    // expect messages to be updated, 3 messages in the chat, the last one is empty and will be filled with loading spinner
    expect(screen.getAllByTestId('message-card')).toHaveLength(3);

    // stop button should be displayed
    const stopButton = screen.getByTestId('stop-button');
    expect(stopButton).toBeInTheDocument();

    // click stop button should call stopChat
    await act(async () => {
      fireEvent.click(stopButton);
    });
    expect(mockUseAssistant.stopChat).toHaveBeenCalled();
  });

  it('restarts the chat when restart button is clicked', async () => {
    render(
      <AiAssistant
        {...mockProps}
        welcomeMessage="Welcome"
        historyMessages={[
          {
            direction: 'incoming',
            sender: 'assistant',
            message: 'Welcome',
            position: 'single',
          },
          {
            direction: 'outgoing',
            sender: 'user',
            message: 'Hello, AI!',
            position: 'single',
          },
          {
            direction: 'incoming',
            sender: 'assistant',
            message: 'Hello, user!',
            position: 'single',
          },
        ]}
      />
    );

    // expect 3 messages in the chat
    expect(screen.getAllByTestId('message-card')).toHaveLength(3);

    const restartButton = screen.getByTestId('restart-button');
    await act(async () => {
      fireEvent.click(restartButton);
    });

    await waitFor(() => {
      expect(mockUseAssistant.restartChat).toHaveBeenCalled();
    });
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  it('send an image message', async () => {
    const onScreenshotClick = jest.fn();

    render(
      <AiAssistant
        {...mockProps}
        onScreenshotClick={onScreenshotClick}
        screenCapturedBase64="data:image/png;test"
        welcomeMessage="Welcome"
        enableScreenCapture={true}
      />
    );

    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'What is in this image?' } });
    });

    // find the screenshot button
    const screenshotButton = screen.getByTestId('screenshot-button');
    expect(screenshotButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screenshotButton);
    });

    expect(onScreenshotClick).toHaveBeenCalled();

    // click send button
    const sendButton = screen.getByTestId('send-button');
    await act(async () => {
      fireEvent.click(sendButton);
    });

    expect(mockUseAssistant.sendImageMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        imageBase64String: 'data:image/png;test',
        message: 'What is in this image?',
        streamMessageCallback: expect.any(Function),
      })
    );
  });

  it('sends a voice message', async () => {
    render(
      <AiAssistant {...mockProps} welcomeMessage="Welcome" enableVoice={true} />
    );

    // find the voice chat button
    const voiceChatButton = screen.getByTestId('voice-chat-button');
    expect(voiceChatButton).toBeInTheDocument();

    await act(async () => {
      // click the voice chat button to start recording
      fireEvent.click(voiceChatButton);
    });

    await act(async () => {
      // click the voice chat button to stop recording
      fireEvent.click(voiceChatButton);
    });

    expect(mockUseAssistant.audioToText).toHaveBeenCalledWith(expect.any(Blob));
  });

  it('thumbs down to report a question', async () => {
    const onFeedback = jest.fn();
    render(
      <AiAssistant
        {...mockProps}
        welcomeMessage="Welcome"
        onFeedback={onFeedback}
        historyMessages={[
          {
            direction: 'incoming',
            sender: 'assistant',
            message: 'Welcome',
            position: 'single',
          },
          {
            direction: 'outgoing',
            sender: 'user',
            message: 'Hello, AI!',
            position: 'single',
          },
          {
            direction: 'incoming',
            sender: 'assistant',
            message: 'Hello, user!',
            position: 'single',
          },
        ]}
      />
    );

    // mock mouse over the third message card
    const messageCard = screen.getAllByTestId('message-card')[2];
    await act(async () => {
      fireEvent.mouseOver(messageCard);
    });

    // find the thumbs down buttons
    const thumbsDownButton = screen.getAllByTestId('feedback-button')[1];

    // the last one should be visible
    expect(thumbsDownButton).toBeVisible();

    await act(async () => {
      fireEvent.click(thumbsDownButton);
    });

    // the question is the third message
    const question = 'Hello, user!';

    // expect the feedback to be reported
    expect(onFeedback).toHaveBeenCalledWith(question);
  });

  it.skip('test message dragging functionality', async () => {
    // Create a mock for the dataTransfer object
    const mockDataTransfer = {
      setData: jest.fn(),
    };

    render(<AiAssistant {...mockProps} welcomeMessage="Welcome" />);

    // find the message card
    const messageCard = screen.getAllByTestId('message-card')[0];

    // drag the message card to the top
    await act(async () => {
      fireEvent.dragStart(messageCard, { dataTransfer: mockDataTransfer });
    });

    // This should now work without errors
    expect(mockDataTransfer.setData).toHaveBeenCalledWith(
      'text/plain',
      JSON.stringify({
        id: 'message-0',
        type: 'text',
        message: 'Welcome',
      })
    );
  });

  it('failed message should be shown', () => {
    render(
      <AiAssistant
        {...mockProps}
        welcomeMessage="Welcome"
        historyMessages={[
          {
            direction: 'incoming',
            sender: 'assistant',
            message: 'Welcome',
            position: 'single',
          },
          {
            direction: 'outgoing',
            sender: 'user',
            message: 'Hello, AI!',
            position: 'single',
          },
          {
            direction: 'incoming',
            sender: 'Error',
            message: 'Error message',
            position: 'single',
          },
        ]}
      />
    );

    // expect the error message to be shown
    expect(screen.getByTestId('failed-message')).toBeInTheDocument();

    // the html content should have bg-danger-100/50 in the class
    const failedMessage = screen.getAllByTestId('message-card')[2];
    expect(failedMessage.innerHTML).toContain('Sorry, something went wrong.');
  });
});
