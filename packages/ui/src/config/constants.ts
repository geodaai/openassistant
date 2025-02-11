export const MODEL_PROVIDERS = {
  deepseek: {
    name: 'DeepSeek',
    models: ['deepseek-chat'],
  },
  openai: {
    name: 'OpenAI',
    models: [
      'gpt-o1',
      'gpt-o1-preview',
      'gpt-o1-mini',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-0125',
    ],
  },
  google: {
    name: 'Google',
    models: [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro'
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
