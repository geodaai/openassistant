// Default provider base URLs and models, plus initial AI settings

export const OLLAMA_DEFAULT_BASE_URL = 'http://localhost:11434/api';

export const PROVIDER_DEFAULT_BASE_URLS = {
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  google: 'https://generativelanguage.googleapis.com/v1beta',
  deepseek: 'https://api.deepseek.com/v1',
  ollama: OLLAMA_DEFAULT_BASE_URL,
} as const;

export const LLM_MODELS = [
  {
    name: 'openai',
    models: ['gpt-4.1', 'gpt-5.1'],
  },
  {
    name: 'anthropic',
    models: ['claude-4-5-sonnet', 'claude-4-5-haiku'],
  },
  {
    name: 'google',
    models: ['gemini-3-pro-preview', 'gemini-2.5-pro', 'gemini-2.5-flash'],
  },
  {
    name: 'ollama',
    models: ['qwen3:32b', 'gpt-oss'],
  },
];

export const AI_SETTINGS = {
  providers: LLM_MODELS.reduce((acc: Record<string, unknown>, provider) => {
    acc[provider.name] = {
      baseUrl:
        PROVIDER_DEFAULT_BASE_URLS[
          provider.name as keyof typeof PROVIDER_DEFAULT_BASE_URLS
        ],
      apiKey: '',
      models: provider.models.map((model) => ({
        id: model,
        modelName: model,
      })),
    };
    return acc;
  }, {}),
};
