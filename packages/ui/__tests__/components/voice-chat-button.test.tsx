// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * @jest-environment jsdom
 */
import React, { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
jest.mock('react-audio-voice-recorder');

import VoiceChatButton from '../../src/components/voice-chat-button';
import { useAudioRecorder } from 'react-audio-voice-recorder';

(useAudioRecorder as jest.Mock).mockReturnValue({
  isRecording: false,
  recordingBlob: new Blob(['test'], { type: 'audio/wav' }),
  startRecording: jest.fn(),
  stopRecording: jest.fn(() => new Blob(['test'], { type: 'audio/wav' })),
});

describe('VoiceChatButton', () => {
  it('renders correctly', () => {
    // override the default mock for useAudioRecorder
    const { container } = render(
      <VoiceChatButton onRecordingComplete={() => Promise.resolve()} />
    );
    expect(container).toMatchSnapshot();
  });

  it('starts recording on button click', async () => {
    const { startRecording } = useAudioRecorder();
    await act(async () => {
      render(<VoiceChatButton onRecordingComplete={jest.fn()} />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Talk to Ask'));
    });
    expect(startRecording).toHaveBeenCalled();
  });

  it('stops recording on button click when already recording', async () => {
    const { stopRecording } = useAudioRecorder();
    render(<VoiceChatButton onRecordingComplete={jest.fn()} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Talk to Ask'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Talk to Ask'));
    });
    expect(stopRecording).toHaveBeenCalled();
  });

  it('calls onRecordingComplete with the recording blob', async () => {
    const mockOnRecordingComplete = jest.fn();
    render(<VoiceChatButton onRecordingComplete={mockOnRecordingComplete} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Talk to Ask')); // Start recording
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Talk to Ask')); // Stop recording
    });

    expect(mockOnRecordingComplete).toHaveBeenCalledWith(expect.any(Blob));
  });
});
