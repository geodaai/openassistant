// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAudioRecorder } from 'react-audio-voice-recorder';

export default function VoiceChatButton({
  onRecordingComplete,
}: {
  onRecordingComplete: (voice: Blob) => Promise<void>;
}) {
  const [shouldSave, setShouldSave] = useState(false);

  const { isRecording, recordingBlob, startRecording, stopRecording } =
    useAudioRecorder(
      { noiseSuppression: true, echoCancellation: true },
      (err) => console.table(err) // onNotAllowedOrFound
    );

  const [recording, setRecording] = useState(isRecording);

  const onTalkClicked = async () => {
    if (recording) {
      stopRecording();
      setShouldSave(true);
      setRecording(false);
    } else {
      startRecording();
      setRecording(true);
    }
  };

  useEffect(() => {
    if (shouldSave && recordingBlob) {
      onRecordingComplete(recordingBlob);
      setShouldSave(false);
    }
  }, [onRecordingComplete, recordingBlob, shouldSave]);

  return (
    <Button
      size="sm"
      startContent={
        <Icon
          className="text-gray-500 dark:text-gray-400 min-w-4"
          icon="solar:soundwave-linear"
          width={18}
        />
      }
      endContent={
        isRecording && (
          <svg
            className="h-4 w-4 animate-spin text-current"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-75"
              cx="12"
              cy="12"
              r="4"
              strokeWidth="0"
              fill="red"
            />
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              className="opacity-50"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
              strokeWidth="2"
            />
          </svg>
        )
      }
      variant="flat"
      onPress={onTalkClicked}
      data-testid="voice-chat-button"
    >
      Talk to Ask
    </Button>
  );
}
