import { GoogleAIAssistant } from '../../src/llm/google';

// Mock external dependencies
jest.mock('@langchain/google-genai');

describe('GoogleAssistant', () => {
  beforeEach(() => {
    // Reset the instance before each test
    GoogleAIAssistant['instance'] = null;
    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should throw an error if model or API key is not set', async () => {
    await expect(GoogleAIAssistant.getInstance()).rejects.toThrow(
      'LLM is not configured. Please call configure() first.'
    );
  });

  it('should create a new instance if none exists', async () => {
    GoogleAIAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });
    const instance = await GoogleAIAssistant.getInstance();
    expect(instance).toBeInstanceOf(GoogleAIAssistant);
  });

  it('should return the existing instance if it exists', async () => {
    GoogleAIAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });
    const instance1 = await GoogleAIAssistant.getInstance();
    const instance2 = await GoogleAIAssistant.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should create a new instance if model or API key changes', async () => {
    GoogleAIAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });
    const instance1 = await GoogleAIAssistant.getInstance();

    // Simulate a change in model or API key
    GoogleAIAssistant.configure({
      model: 'new-model',
      apiKey: 'new-api-key',
    });
    const instance2 = await GoogleAIAssistant.getInstance();

    // instance should be the same, however the aiModel is different
    expect(instance1).toBe(instance2);
  });

  it('should reset the instance', async () => {
    GoogleAIAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    })
    const instance1 = await GoogleAIAssistant.getInstance();
    instance1.restart();

    const instance2 = await GoogleAIAssistant.getInstance();
    expect(instance1).not.toBe(instance2);
  });

  it('should convert audio blob to text', async () => {
    const mockAudioBlob = new Blob(['fake audio data'], {
      type: 'audio/wav',
    });

    GoogleAIAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });
    const instance = await GoogleAIAssistant.getInstance();
    const result = await instance.audioToText({ audioBlob: mockAudioBlob });

    expect(result).toBe('Transcribed text');
  });

  it('should handle errors when LLM is not initialized', async () => {
    // clear mock
    jest.clearAllMocks();

    GoogleAIAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });
    const instance = await GoogleAIAssistant.getInstance();

    // set the aiModel to null
    instance['aiModel'] = null;

    await expect(
      instance.audioToText({ audioBlob: new Blob() })
    ).rejects.toThrow('LLM instance is not initialized');
  });

  it('should return empty string if no valid JSON is found in response', async () => {
    GoogleAIAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });

    const instance = await GoogleAIAssistant.getInstance();
    const result = await instance.audioToText({
      audioBase64: 'base64string',
    });

    expect(result).toBe('');
  });

  it('should return empty string if invoke throws error', async () => {
    GoogleAIAssistant.configure({
      model: 'test-model',
      apiKey: 'test-api-key',
    });

    const instance = await GoogleAIAssistant.getInstance();
    const result = await instance.audioToText({
      audioBase64: 'base64string',
    });

    expect(result).toBe('');
  });
});
