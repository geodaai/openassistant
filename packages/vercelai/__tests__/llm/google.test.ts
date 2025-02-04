import { GoogleAssistant } from '../../src/llm/google';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { LangChainAssistant } from '../../src/llm/langchain';

// Mock external dependencies
jest.mock('@langchain/google-genai');

describe('GoogleAssistant', () => {
  beforeEach(() => {
    // Reset the instance before each test
    GoogleAssistant['instance'] = null;
    LangChainAssistant['model'] = '';
    LangChainAssistant['apiKey'] = '';
    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should throw an error if model or API key is not set', async () => {
    await expect(GoogleAssistant.getInstance()).rejects.toThrow(
      'LLM is not configured. Please call configure() first.'
    );
  });

  it('should create a new instance if none exists', async () => {
    GoogleAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });
    const instance = await GoogleAssistant.getInstance();
    expect(instance).toBeInstanceOf(GoogleAssistant);
    expect(ChatGoogleGenerativeAI).toHaveBeenCalledTimes(1);
  });

  it('should return the existing instance if it exists', async () => {
    // mock new ChatGoogleGenerativeAI() return modelName and apiKey, so we can compare them if they are changed
    (ChatGoogleGenerativeAI as unknown as jest.Mock).mockReturnValue({
      call: jest.fn(),
      bindTools: jest.fn(),
      modelName: 'test-model',
      apiKey: 'test-api-key',
    });

    GoogleAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });
    const instance1 = await GoogleAssistant.getInstance();
    const instance2 = await GoogleAssistant.getInstance();

    expect(ChatGoogleGenerativeAI).toHaveBeenCalledTimes(1);
    expect(instance1).toBe(instance2);
  });

  it('should create a new instance if model or API key changes', async () => {
    // mock ChatGoogleGenerativeAI() return modelName and apiKey
    (ChatGoogleGenerativeAI as unknown as jest.Mock).mockReturnValue({
      call: jest.fn(),
      bindTools: jest.fn(),
      modelName: 'test-model',
      apiKey: 'test-api-key',
    });

    GoogleAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });
    const instance1 = await GoogleAssistant.getInstance();

    // mock ChatGoogleGenerativeAI() return new modelName and apiKey
    (ChatGoogleGenerativeAI as unknown as jest.Mock).mockReturnValue({
      call: jest.fn(),
      bindTools: jest.fn(),
      modelName: 'new-model',
      apiKey: 'new-api-key',
    });
    // Simulate a change in model or API key
    GoogleAssistant.configure({
      model: 'new-model',
      apiKey: 'new-api-key',
    });
    const instance2 = await GoogleAssistant.getInstance();

    // instance should be the same, however the aiModel is different
    expect(instance1).toBe(instance2);
    expect(ChatGoogleGenerativeAI).toHaveBeenCalledTimes(2);
  });

  it('should reset the instance', async () => {
    GoogleAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    })
    const instance1 = await GoogleAssistant.getInstance();
    instance1.restart();

    const instance2 = await GoogleAssistant.getInstance();
    expect(instance1).not.toBe(instance2);
  });

  it('should convert audio blob to text', async () => {
    // mock the ChatGoogleGenerativeAI class
    (ChatGoogleGenerativeAI as unknown as jest.Mock).mockReturnValue({
      call: jest.fn(),
      bindTools: jest.fn(),
      invoke: () => ({
        content: JSON.stringify({ text: 'Transcribed text' }),
      }),
    });

    const mockAudioBlob = new Blob(['fake audio data'], {
      type: 'audio/wav',
    });

    GoogleAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });
    const instance = await GoogleAssistant.getInstance();
    const result = await instance.audioToText({ audioBlob: mockAudioBlob });

    expect(result).toBe('Transcribed text');
  });

  it('should handle errors when LLM is not initialized', async () => {
    // clear mock
    jest.clearAllMocks();

    GoogleAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });
    const instance = await GoogleAssistant.getInstance();

    // set the aiModel to null
    instance['aiModel'] = null;

    await expect(
      instance.audioToText({ audioBlob: new Blob() })
    ).rejects.toThrow('LLM instance is not initialized');
  });

  it('should return empty string if no valid JSON is found in response', async () => {
    // mock the ChatGoogleGenerativeAI class
    (ChatGoogleGenerativeAI as unknown as jest.Mock).mockReturnValue({
      call: jest.fn(),
      bindTools: jest.fn(),
      invoke: () => ({
        content: 'invalid response',
      }),
    });

    GoogleAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });

    const instance = await GoogleAssistant.getInstance();
    const result = await instance.audioToText({
      audioBase64: 'base64string',
    });

    expect(result).toBe('');
  });

  it('should return empty string if invoke throws error', async () => {
    // mock the ChatGoogleGenerativeAI class
    (ChatGoogleGenerativeAI as unknown as jest.Mock).mockReturnValue({
      call: jest.fn(),
      bindTools: jest.fn(),
      invoke: () => ({
        content: 1/0,
      }),
    });

    GoogleAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });

    const instance = await GoogleAssistant.getInstance();
    const result = await instance.audioToText({
      audioBase64: 'base64string',
    });

    expect(result).toBe('');
  });
});
