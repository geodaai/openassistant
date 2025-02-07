// add global mocks here
import 'web-streams-polyfill';

global.ReadableStream = jest.fn().mockImplementation(() => ({
  // mock methods you use in your test
  getReader: jest.fn(),
}));

// mock react-audio-voice-recorder used in VoiceChatButton
jest.mock('react-audio-voice-recorder');
import { useAudioRecorder } from 'react-audio-voice-recorder';
(useAudioRecorder as jest.Mock).mockReturnValue({
  isRecording: false,
  recordingBlob: new Blob(['test'], { type: 'audio/wav' }),
  startRecording: jest.fn(),
  stopRecording: jest.fn(() => new Blob(['test'], { type: 'audio/wav' })),
});

// // mock @langchain/core/runnables
// jest.mock('@langchain/core/runnables');
// import { Runnable } from '@langchain/core/runnables';
// (Runnable as unknown as jest.Mock).mockReturnValue({
//   invoke: jest.fn(),
//   stream: jest.fn(),
// });


// jest.mock('openai');
// import OpenAI from '../__mocks__/openai';
// (OpenAI as unknown as jest.Mock).mockReturnValue({
//   create: jest.fn(),
// });

// export const mockMutexRelease = jest.fn();
// jest.mock('async-mutex', () => ({
//   Mutex: jest.fn().mockImplementation(() => ({
//     acquire: jest.fn().mockResolvedValue(mockMutexRelease),
//   })),
// }));

// // Mock FileReader
// class MockFileReader {
//   onload: () => void = () => {};
//   result: string = 'mock file content';
//   readAsText(blob: Blob) {
//     setTimeout(() => {
//       this.onload();
//     }, 0);
//   }

//   readAsDataURL(blob: Blob) {
//     setTimeout(() => {
//       this.result = 'data:text/plain;base64,bW9jayBmaWxlIGNvbnRlbnQ='; // base64 encoded "mock file content"
//       this.onload();
//     }, 0);
//   }
// }

// global.FileReader = MockFileReader as any;
