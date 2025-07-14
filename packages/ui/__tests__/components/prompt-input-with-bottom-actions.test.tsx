// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PromptInputWithBottomActions from '../../src/components/prompt-input-with-bottom-actions';

// mock react-audio-voice-recorder used in VoiceChatButton
jest.mock('react-audio-voice-recorder');
import { useAudioRecorder } from 'react-audio-voice-recorder';
(useAudioRecorder as jest.Mock).mockReturnValue({
  isRecording: false,
  recordingBlob: new Blob(['test'], { type: 'audio/wav' }),
  startRecording: jest.fn(),
  stopRecording: jest.fn(() => new Blob(['test'], { type: 'audio/wav' })),
});

// mock iconify
jest.mock('@iconify/react', () => {
  return {
    Icon: ({ ...props }) => <svg data-testid="icon" {...props} />,
  };
});

describe('PromptInputWithBottomActions Component', () => {
  const mockOnSendMessage = jest.fn();
  const mockOnVoiceMessage = jest.fn().mockResolvedValue('Voice message');
  const mockOnScreenshotClick = jest.fn();
  const mockOnRemoveScreenshot = jest.fn();
  const mockOnStopChat = jest.fn();
  const mockOnRestartChat = jest.fn();

  const defaultProps = {
    onSendMessage: mockOnSendMessage,
    onVoiceMessage: mockOnVoiceMessage,
    onScreenshotClick: mockOnScreenshotClick,
    onRemoveScreenshot: mockOnRemoveScreenshot,
    onStopChat: mockOnStopChat,
    onRestartChat: mockOnRestartChat,
    ideas: [{ title: 'Idea 1', description: 'Description 1' }],
    enableScreenCapture: true,
    enableVoice: true,
    enableAttachFile: false,
    screenCaptured: '',
    defaultPromptText: '',
    status: 'success' as 'success' | 'failed' | 'pending' | undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const container = render(
      <PromptInputWithBottomActions {...defaultProps} />
    );
    expect(container).toMatchSnapshot();

    // check "Screenshot to Ask" button
    expect(screen.getByText('Screenshot to Ask')).toBeInTheDocument();
  });

  it('calls onSendMessage when send button is clicked', async () => {
    await act(async () => {
      render(<PromptInputWithBottomActions {...defaultProps} />);
    });

    const sendButton = screen.getByTestId('send-button');
    expect(sendButton).toBeDisabled();

    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Test message' } });
    });

    expect(sendButton).toBeEnabled();

    await act(async () => {
      fireEvent.click(sendButton);
    });
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('calls onStopChat when stop button is clicked', async () => {
    render(<PromptInputWithBottomActions {...defaultProps} status="pending" />);

    const stopButton = screen.getByTestId('stop-button');
    const icon = stopButton.querySelector('.text-primary-foreground');
    expect(icon).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(stopButton);
    });
    expect(mockOnStopChat).toHaveBeenCalled();
  });

  it('calls onRestartChat when restart button is clicked', async () => {
    render(<PromptInputWithBottomActions {...defaultProps} />);
    const restartButton = screen.getByTestId('restart-button');
    await act(async () => {
      fireEvent.click(restartButton);
    });
    expect(mockOnRestartChat).toHaveBeenCalled();
  });

  it('displays ideas and allows clicking on them', async () => {
    render(<PromptInputWithBottomActions {...defaultProps} />);
    const ideaButton = screen.getByText('Idea 1');
    await act(async () => {
      fireEvent.click(ideaButton);
    });
    expect(screen.getByRole('textbox')).toHaveValue('Idea 1\nDescription 1');
  });

  it('calls onRemoveScreenshot when remove screenshot button is clicked', async () => {
    render(
      <PromptInputWithBottomActions
        {...defaultProps}
        screenCaptured="image.png"
      />
    );
    const removeButton = screen.getByTestId('removescreenshot-button');
    await act(async () => {
      fireEvent.click(removeButton);
    });
    expect(mockOnRemoveScreenshot).toHaveBeenCalled();
  });

  it('calls onSendMessage when screenshot and defaultPromptText are passed', async () => {
    render(
      <PromptInputWithBottomActions
        {...defaultProps}
        screenCaptured="base64image"
        defaultPromptText="how to use this?"
      />
    );
    // Mock useEffect
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    // Wait for the next tick to allow useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockOnSendMessage).toHaveBeenCalledWith('how to use this?');
    expect(mockOnRemoveScreenshot).toHaveBeenCalled();
  });

  it('calls onSendMessage when typing in the input and hitting Shift+Enter', async () => {
    render(<PromptInputWithBottomActions {...defaultProps} />);
    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Test message' } });
    });
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    });

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');

    // Test that regular Enter doesn't trigger onSendMessage
    mockOnSendMessage.mockClear();
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('does not call onSendMessage when hitting Shift+Enter without text', async () => {
    render(<PromptInputWithBottomActions {...defaultProps} />);
    const input = screen.getByRole('textbox');
    await act(async () => {
      fireEvent.keyDown(input, { shiftKey: true });
    });
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('calls onRecordingComplete when recording is complete', async () => {
    render(<PromptInputWithBottomActions {...defaultProps} />);
    const voiceChatButton = screen.getByTestId('voice-chat-button');
    await act(async () => {
      fireEvent.click(voiceChatButton);
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => {
      fireEvent.click(voiceChatButton);
    });

    expect(mockOnVoiceMessage).toHaveBeenCalled();
  });

  it('show Attach File button when enableAttachFile is true', () => {
    render(<PromptInputWithBottomActions {...defaultProps} enableAttachFile={true} />);
    const attachFileButton = screen.getByText('Attach');
    expect(attachFileButton).toBeInTheDocument();
  });
});
