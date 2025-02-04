import { LangChainAssistant } from '../../src/llm/langchain';
import { OllamaAssistant } from '../../src/llm/ollama';
import { ChatOllama } from '@langchain/ollama';

jest.mock('@langchain/ollama');
// mock trimMessages from @langchain/core/messages
jest.mock('@langchain/core/messages', () => ({
  ...jest.requireActual('@langchain/core/messages'),
  trimMessages: jest.fn(),
}));

describe('OllamaAssistant', () => {
  beforeEach(async () => {
    // Reset the static properties before each test
    OllamaAssistant['instance'] = null;
    OllamaAssistant['baseUrl'] = '';
    OllamaAssistant['aiModel'] = null;
    LangChainAssistant['model'] = '';

    // clear all mocks
    jest.clearAllMocks();
  });

  test('should throw an error if model or baseUrl is not set', async () => {
    await expect(OllamaAssistant.getInstance()).rejects.toThrow(
      'Base URL is not configured. Please call configure() first.'
    );
  });

  test('should create a new instance of OllamaAssistant', async () => {
    OllamaAssistant.configure({
      baseUrl: 'http://localhost:3000',
      model: 'test-model',
    });
    const instance = await OllamaAssistant.getInstance();
    expect(instance).toBeInstanceOf(OllamaAssistant);
  });

  test('should configure OllamaAssistant properties', async () => {
    OllamaAssistant.configure({
      baseUrl: 'http://localhost:3000',
      model: 'test-model',
      instructions: 'test instructions',
      temperature: 0.5,
      topP: 0.9,
    });

    expect(OllamaAssistant['baseUrl']).toBe('http://localhost:3000');
    expect(OllamaAssistant['model']).toBe('test-model');
    expect(OllamaAssistant['instructions']).toBe('test instructions');
    expect(OllamaAssistant['temperature']).toBe(0.5);
    expect(OllamaAssistant['topP']).toBe(0.9);
  });

  test('should return the existing instance if it exists', async () => {
    await OllamaAssistant.configure({
      baseUrl: 'http://localhost:3000',
      model: 'test-model',
    });

    const instance1 = await OllamaAssistant.getInstance();
    const instance2 = await OllamaAssistant.getInstance();

    expect(instance1).toBe(instance2);
  });

  test('should create a new instance if model or baseUrl changes', async () => {
    // mock ChatOllama() return modelName and baseUrl
    (ChatOllama as unknown as jest.Mock).mockReturnValue({
      call: jest.fn(),
      bind: jest.fn(),
      model: 'test-model',
      baseUrl: 'http://localhost:3000',
    });

    OllamaAssistant.configure({
      baseUrl: 'http://localhost:3000',
      model: 'test-model',
    });

    const instance1 = await OllamaAssistant.getInstance();

    // mock ChatOllama() return new modelName and baseUrl
    (ChatOllama as unknown as jest.Mock).mockReturnValue({
      call: jest.fn(),
      bind: jest.fn(),
      model: 'new-model',
      baseUrl: 'http://localhost:3001',
    });

    OllamaAssistant.configure({
      baseUrl: 'http://localhost:3001',
      model: 'new-model',
    });

    const instance2 = await OllamaAssistant.getInstance();

    // The instance should be the same, and the aiModel should be different
    expect(instance1).toBe(instance2);
    expect(ChatOllama).toHaveBeenCalledTimes(2);
  });

  test('should reset the instance on restart', async () => {
    OllamaAssistant.configure({
      baseUrl: 'http://localhost:3000',
      model: 'test-model',
    });

    const instance = await OllamaAssistant.getInstance();
    instance.restart();

    const newInstance = await OllamaAssistant.getInstance();
    expect(instance).not.toBe(newInstance);
  });

  test('should throw an error when calling audioToText', async () => {
    OllamaAssistant.configure({
      baseUrl: 'http://localhost:3000',
      model: 'test-model',
    });

    const instance = await OllamaAssistant.getInstance();
    await expect(instance.audioToText({})).rejects.toThrow(
      'Method not implemented.'
    );
  });

  test('should throw an error when calling processTextMessage if aiModel is not set', async () => {
    OllamaAssistant.configure({
      baseUrl: 'http://localhost:3000',
      model: 'test-model',
    });
    const instance = await OllamaAssistant.getInstance();

    instance['aiModel'] = null;

    await expect(
      instance.processTextMessage({
        textMessage: '',
        streamMessageCallback: jest.fn(),
      })
    ).rejects.toThrow('LLM instance is not initialized');
  });

  test('should throw an error when calling processImageMessage', async () => {
    const mockStreamMessageCallback = jest.fn();

    // mock the stream method of ChatOllama
    const mockStream = jest.fn().mockResolvedValue([]);
    (ChatOllama as unknown as jest.Mock).mockImplementation(() => ({
      bind: () => ({
        stream: () => mockStream(),
      }),
      stream: () => mockStream(),
    }));

    OllamaAssistant.configure({
      baseUrl: 'http://localhost:3000',
      model: 'test-model',
    });
    const instance = await OllamaAssistant.getInstance();
    await instance.processImageMessage({
      imageMessage: '',
      textMessage: '',
      streamMessageCallback: mockStreamMessageCallback,
    });

    expect(mockStreamMessageCallback).toHaveBeenCalledWith({
      deltaMessage: '',
      isCompleted: true,
    });
  });

  // class for returning a response with property 'content' and method 'concat'
  class Response {
    content: string;
    concat: (res: Response) => Response;
    constructor(content: string) {
      this.content = content;
      this.concat = (res) => new Response(this.content + res.content);
    }
  }

  describe('should process text message and return response', () => {

    test('should process text message and return response', async () => {
      const mockStreamMessageCallback = jest.fn();
      const textMessage = 'What is the weather today?';

      // Mock the stream method of ChatOllama to return a response that the prompt cannot be answered by a tool
      const mockFirstStream = jest.fn().mockResolvedValue([new Response('No')]);
      const mockSecondStream = jest
        .fn()
        .mockResolvedValue([
          new Response('It '),
          new Response('is '),
          new Response('sunny.'),
        ]);
      let streamCount = 0;
      (ChatOllama as unknown as jest.Mock).mockImplementation(() => ({
        bind: jest.fn(),
        stream: () => {
          if (streamCount === 0) {
            streamCount++;
            return mockFirstStream();
          } else {
            return mockSecondStream();
          }
        },
      }));

      OllamaAssistant.configure({
        baseUrl: 'http://localhost:3000',
        model: 'test-model',
      });
      const instance = await OllamaAssistant.getInstance();

      await instance.processTextMessage({
        textMessage,
        streamMessageCallback: mockStreamMessageCallback,
      });

      expect(mockFirstStream).toHaveBeenCalled();
      expect(mockSecondStream).toHaveBeenCalled();
      expect(mockStreamMessageCallback).toHaveBeenCalledWith({
        deltaMessage: 'It is sunny.',
        isCompleted: true,
      });
    });

    class ResponseWithTool {
      content: string;
      tool_calls: unknown[];
      concat: (res: ResponseWithTool) => ResponseWithTool;
      constructor(content: string, tool_calls: unknown[]) {
        this.content = content;
        this.tool_calls = tool_calls;
        this.concat = (res) =>
          new ResponseWithTool(this.content + res.content, this.tool_calls);
      }
    }

    test('should process text message using tools', async () => {
      const mockStreamMessageCallback = jest.fn();

      const mockCallbackFunction = jest.fn();
      const textMessage = 'What is the temperature in Tokyo?';

      // Mock the stream method of ChatOllama to return a response that the prompt cannot be answered by a tool
      const mockToolCalls = [
        {
          name: 'get_temperature',
          args: { city: 'Tokyo' },
        },
      ];
      const mockFirstStream = jest
        .fn()
        .mockResolvedValue([new ResponseWithTool('Yes', mockToolCalls)]);
      const mockSecondStream = jest
        .fn()
        .mockResolvedValue([
          new ResponseWithTool('80 ', mockToolCalls),
          new ResponseWithTool('degrees Fahrenheit.', mockToolCalls),
        ]);
      let toolStreamCount = 0;
      (ChatOllama as unknown as jest.Mock).mockImplementation(() => ({
        // aiModel.bind(tools) stream() for tool calling
        bind: () => ({
          stream: () => {
            if (toolStreamCount === 0) {
              toolStreamCount++;
              return mockFirstStream();
            } else {
              return mockSecondStream();
            }
          },
        }),
        // aiModel stream() for checking if the prompt can be answered by a tool
        stream: () => mockFirstStream(),
      }));

      OllamaAssistant.configure({
        baseUrl: 'http://localhost:3000',
        model: 'test-model',
      });
      OllamaAssistant.registerFunctionCalling({
        name: 'get_temperature',
        description: 'Get the temperature of a city',
        properties: {
          city: {
            type: 'string',
            description: 'The city to get the temperature of',
          },
        },
        required: ['city'],
        callbackFunction: mockCallbackFunction,
      });
      const instance = await OllamaAssistant.getInstance();

      await instance.processTextMessage({
        textMessage,
        streamMessageCallback: mockStreamMessageCallback,
      });

      // Wait for any pending promises to resolve
      await new Promise(process.nextTick);

      expect(mockFirstStream).toHaveBeenCalledTimes(2);
      expect(mockSecondStream).toHaveBeenCalledTimes(1);
      expect(mockCallbackFunction).toHaveBeenCalled();

      expect(mockStreamMessageCallback.mock.calls).toEqual([
        [{ deltaMessage: 'Yes' }],
        [{ deltaMessage: 'Yes\n\n80 ' }],
        [{ deltaMessage: 'Yes\n\n80 degrees Fahrenheit.' }],
        [
          {
            deltaMessage: 'Yes\n\n80 degrees Fahrenheit.',
            customMessage: null,
            isCompleted: true,
          },
        ],
      ]);
    });
  });
});
