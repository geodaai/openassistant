import axios from 'axios';

type ConnectionTestResult = {
  service: string;
  success: boolean;
  message: string;
};

export async function testApiKey({
  apiKey,
  modelProvider,
  modelName,
  baseUrl,
}: {
  apiKey: string;
  modelProvider: string;
  modelName: string;
  baseUrl: string;
}): Promise<ConnectionTestResult> {
  const modelProviderLowerCase = modelProvider.toLowerCase();
  if (modelProviderLowerCase === 'openai') {
    return testOpenAIChatGPTConnection(apiKey, modelName);
  } else if (modelProviderLowerCase === 'google') {
    return testGeminiConnection(apiKey, modelName);
  } else if (modelProviderLowerCase === 'ollama') {
    return testOllamConnection(modelName, baseUrl);
  } else if (modelProviderLowerCase === 'anthropic') {
    return testAnthropicConnection(modelName, modelName);
  } else if (modelProviderLowerCase === 'deepseek') {
    return testDeepSeekConnection(apiKey, modelName);
  } else if (modelProviderLowerCase === 'phoenixai') {
    // TODO: implement PhoenixAI connection test
    return {
      service: 'PhoenixAI',
      success: false,
      message: 'PhoenixAI connection test not implemented',
    };
  } else {
    return {
      service: 'Unknown',
      success: false,
      message: 'Unknown model provider',
    };
  }
}

export async function testAnthropicConnection(
  apiKey: string,
  modelName: string
): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    service: 'anthropic',
    success: false,
    message: '',
  };

  // Test Anthropic connection
  try {
    await axios.post(
      `https://api.anthropic.com/v1/messages`,
      {
        model: modelName,
        messages: [{ role: 'user', content: 'Hello!' }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    result.success = true;
    result.message = 'Connection successful';
  } catch (error) {
    result.success = false;
    result.message = `${error}`;
  }

  return result;
}

export async function testOpenAIChatGPTConnection(
  apiKey: string,
  modelName: string
): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    service: 'openai',
    success: false,
    message: '',
  };

  // Test OpenAI connection
  try {
    await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: modelName,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: 'Hello!',
          },
        ],
        max_tokens: 5,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    result.success = true;
    result.message = 'Connection successful';
  } catch (error) {
    result.success = false;
    result.message = `${error}`;
  }

  return result;
}

export async function testGeminiConnection(
  apiKey: string,
  modelName: string
): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    service: 'google',
    success: false,
    message: '',
  };

  // Test Gemini connection
  try {
    await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: 'Hello',
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    result.success = true;
    result.message = 'Connection successful';
  } catch (error) {
    result.success = false;
    result.message = `${error}`;
  }

  return result;
}

export async function testOllamConnection(
  modelName: string,
  baseUrl: string
): Promise<ConnectionTestResult> {
  const results: ConnectionTestResult = {
    service: 'ollama',
    success: false,
    message: '',
  };

  // Test Ollama connection
  try {
    await axios.post(`${baseUrl}/api/generate`, {
      model: modelName,
      prompt: 'hello',
    });
    results.success = true;
    results.message = 'Connection successful';
  } catch (error) {
    results.success = false;
    results.message = `${error}`;
  }

  return results;
}

export async function testDeepSeekConnection(
  apiKey: string,
  modelName: string
): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    service: 'deepseek',
    success: false,
    message: '',
  };

  // Test DeepSeek connection
  try {
    await axios.post(
      `https://api.deepseek.com/chat/completions`,
      {
        model: modelName,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: 'Hello!',
              },
            ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    result.success = true;
    result.message = 'Connection successful';
  } catch (error) {
    result.success = false;
    result.message = `${error}`;
  }

  return result;
}
