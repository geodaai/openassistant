export const MODEL_PROVIDERS = {
  deepseek: {
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  openai: {
    name: 'OpenAI',
    models: [
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-0125',
      'gpt-4',
      'gpt-4-turbo',
      'gpt-4-32k',
    ],
  },
  google: {
    name: 'Google',
    models: [
      'gemini-pro',
      'gemini-pro-vision',
      'gemini-1.5-pro',
      'gemini-1.5-pro-vision',
    ],
  },
  ollama: {
    name: 'Ollama',
    models: [
      'deepseek-coder',
      'deepseek-coder:6.7b',
      'deepseek-coder:33b',
      'phi-2',
      'qwen:14b',
      'qwen:72b',
      'llama2',
      'llama2:70b',
      'llava',
      'mistral',
      'gemma:2b',
      'gemma:7b',
      'phi-3',
    ],
  },
}
