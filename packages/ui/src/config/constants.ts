// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * The default AI Models for ConfigPanel component.
 *
 * It includes the following providers:
 * - DeepSeek
 * - OpenAI
 * - Anthropic
 * - Google
 * - XAI
 * - Ollama
 *
 * You can override the default models by providing a different models.
 */
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
  anthropic: {
    name: 'Anthropic',
    models: [
      'claude-3.7-sonnet',
      'claude-3.5-sonnet',
      'claude-3.5-haiku',
      'claude-3-opus',
      'claude-3-sonnet',
      'claude-3-haiku',
    ],
  },
  google: {
    name: 'Google',
    models: [
      'gemini-2.5-pro-exp-03-25',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro',
    ],
  },
  xai: {
    name: 'Grok',
    models: ['grok-3', 'grok-3-fast', 'grok-3-mini', 'grok-3-mini-fast'],
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
};
