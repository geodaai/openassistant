// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { AbstractAssistant } from '../../src/llm/assistant';
import { ProcessImageMessageProps } from '../../src/types';
import { RegisterFunctionCallingProps } from '../../src/types';

describe('AbstractAssistant', () => {
  let assistant: AbstractAssistant;

  beforeEach(() => {
    assistant = new class extends AbstractAssistant {}();
  });

  test('getInstance should throw an error', async () => {
    await expect(AbstractAssistant.getInstance()).rejects.toThrow(
      'Method not implemented.'
    );
  });

  test('configure should throw an error', () => {
    expect(() =>
      AbstractAssistant.configure({
        model: 'test',
        apiKey: 'key',
      })
    ).toThrow('Method not implemented.');
  });

  test('close should throw an error', async () => {
    await expect(assistant.close()).rejects.toThrow('Method not implemented.');
  });

  test('stop should throw an error', () => {
    expect(() => assistant.stop()).toThrow('Method not implemented.');
  });

  test('restart should throw an error', () => {
    expect(() => assistant.restart()).toThrow('Method not implemented.');
  });
  test('processImageMessage should throw an error', async () => {
    const mockProps: ProcessImageMessageProps = {
      imageMessage: 'base64_encoded_image_string',
      textMessage: 'Sample text message',
      streamMessageCallback: jest.fn(),
    };
    await expect(assistant.processImageMessage(mockProps)).rejects.toThrow(
      'Method not implemented.'
    );
  });

  test('translateVoiceToText should throw an error', async () => {
    await expect(assistant.translateVoiceToText(new Blob())).rejects.toThrow(
      'Method not implemented.'
    );
  });

  test('processTextMessage should throw an error', async () => {
    const mockProps = {
      textMessage: 'Sample text',
      streamMessageCallback: jest.fn(),
    };
    await expect(assistant.processTextMessage(mockProps)).rejects.toThrow(
      'Method not implemented.'
    );
  });

  test('registerFunctionCalling should throw an error', () => {
    const mockProps: RegisterFunctionCallingProps = {
      name: 'testFunction',
      description: 'A test function',
      properties: {},
      required: [],
      callbackFunction: () => ({
        name: 'name',
        type: 'type',
        result: 'result',
      }),
    };
    expect(() => AbstractAssistant.registerFunctionCalling(mockProps)).toThrow(
      'Method not implemented.'
    );
  });

  test('audioToText should throw an error', async () => {
    const mockAudioBlob = new Blob([], { type: 'audio/wav' });
    await expect(
      assistant.audioToText({ audioBlob: mockAudioBlob })
    ).rejects.toThrow('Method not implemented.');
  });

  test('addAdditionalContext should throw an error', async () => {
    await expect(
      assistant.addAdditionalContext({ context: 'test' })
    ).rejects.toThrow('Method not implemented.');
  });
});
