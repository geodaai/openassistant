export const MODEL_PROVIDERS = {
  deepseek: {
    name: 'DeepSeek',
    models: ['deepseek-chat'],
  },
  openai: {
    name: 'OpenAI',
    models: [
      'gpt-4.1',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4',
      'gpt-3.5-turbo',
      'o1',
      'o1-preview',
      'o1-mini',
    ],
  },
  google: {
    name: 'Google',
    models: [
      'gemini-2.5-flash-preview-04-17',
      'gemini-2.5-pro-preview-05-06',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
    ],
  },
  ollama: {
    name: 'Ollama',
    models: [
      'deepseek-r1',
      'gemma3',
      'llama4',
      'llama3.3',
      'mistral',
      'phi4',
      'qwen3',
      'qwen2.5',
    ],
  },
};
