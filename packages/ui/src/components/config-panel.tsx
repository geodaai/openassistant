import { Button, Input, SelectItem, Slider } from '@nextui-org/react';
import { Select } from '@nextui-org/react';
import { testApiKey } from '@openassistant/core';
import { ChangeEvent, useState } from 'react';

// Add a type for valid providers
type Provider = 'openai' | 'google' | 'ollama' | 'deepseek';

const PROVIDER_MODELS: Record<Provider, string[]> = {
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo-0125', 'gpt-3.5-turbo'],
  google: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'],
  ollama: [
    'deepseek-r1', // default 7b model
    'deepseek-r1:14b',
    'deepseek-r1:32b',
    'deepseek-r1:70b',
    'deepseek-r1:671b',
    'phi4',
    'qwen2.5-coder',
    'llama3.3',
    'llama3.2',
    'llama3.1',
    'llama3.1:70b',
    'qwen2',
    'llava',
    'mistral',
    'gemma2',
    'phi3.5',
  ],
};

/**
 * The configuration for the AI Assistant.
 *
 * @property {boolean} isReady - Whether the AI Assistant is ready to use.
 * @property {string} provider - The AI provider.
 * @property {string} model - The AI model.
 * @property {string} apiKey - The API key for the AI provider.
 * @property {string} baseUrl - The base URL for the AI provider.
 * @property {number} temperature - The temperature for the AI model.
 * @property {number} topP - The top P for the AI model.
 */
export type AiAssistantConfig = {
  isReady: boolean;
  provider: Provider;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
  topP: number;
};

/**
 * The props for the ConfigPanel component.
 *
 * @property {Record<string, string[]>} defaultProviderModels - The default models for each provider.
 * @property {AiAssistantConfig} initialConfig - The initial configuration for the AI Assistant.
 * @property {function} onConfigChange - The function to call when the configuration changes.
 */
export type ConfigPanelProps = {
  defaultProviderModels?: Record<Provider, string[]>;
  initialConfig?: AiAssistantConfig;
  showStartChatButton?: boolean;
  showParameters?: boolean;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  onConfigChange: (config: AiAssistantConfig) => void;
};

/**
 * The AI Assistant configuration panel.
 *
 * @param props - The props for the ConfigPanel component. See {@link ConfigPanelProps} for more information.
 * @returns {JSX.Element} The rendered ConfigPanel component.
 */
export function ConfigPanel(props: ConfigPanelProps) {
  const defaultProviderModels = props.defaultProviderModels || PROVIDER_MODELS;

  const [provider, setProvider] = useState(
    props.initialConfig?.provider || 'openai'
  );
  const [model, setModel] = useState(
    props.initialConfig?.model || defaultProviderModels[provider][0]
  );
  const [apiKey, setApiKey] = useState(props.initialConfig?.apiKey || '');
  const [temperature, setTemperature] = useState(
    props.initialConfig?.temperature || 0.8
  );
  const [topP, setTopP] = useState(props.initialConfig?.topP || 0.8);
  const [baseUrl, setBaseUrl] = useState(
    props.initialConfig?.baseUrl || 'http://localhost:11434'
  );
  const [connectionError, setConnectionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const onAiProviderSelect = (
    value: string | number | boolean | object | null
  ) => {
    if (value && typeof value === 'object' && 'currentKey' in value) {
      const selectedProvider = value.currentKey as Provider;
      setProvider(selectedProvider);
      setModel(defaultProviderModels[selectedProvider][0]);
      setConnectionError(false);
      setErrorMessage('');
    }
  };

  const onLLMModelSelect = (
    value: string | number | boolean | object | null
  ) => {
    if (value && typeof value === 'object' && 'currentKey' in value) {
      const selectedModel = value.currentKey as string;
      setModel(selectedModel);
    }
  };

  const onApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    // reset previous key error if any
    setConnectionError(false);
    setErrorMessage('');
  };

  const onTemperatureChange = (value: number | number[]) => {
    setTemperature(typeof value === 'number' ? value : value[0]);
  };

  const onTopPChange = (value: number | number[]) => {
    setTopP(typeof value === 'number' ? value : value[0]);
  };

  const onBaseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseUrl(e.target.value);
    setConnectionError(false);
    setErrorMessage('');
  };

  const onStartChat = async () => {
    setIsRunning(true);
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error('Connection timed out after 10 seconds')),
          10000
        );
      });

      const testResult = await Promise.race([
        testApiKey({
          modelProvider: provider,
          modelName: model,
          apiKey: apiKey,
          baseUrl: baseUrl,
        }),
        timeoutPromise,
      ]);

      const { success, service } = testResult as {
        success: boolean;
        service: string;
      };

      const errorMessage = !success
        ? service === 'ollama'
          ? 'Connection failed: maybe invalid Ollama Base URL'
          : 'Connection failed: maybe invalid API Key'
        : '';

      setConnectionError(!success);
      setErrorMessage(errorMessage);
      props.onConfigChange?.({
        provider: provider,
        model: model,
        apiKey: apiKey,
        baseUrl: baseUrl,
        isReady: success,
        temperature: temperature,
        topP: topP,
      });
    } catch (error) {
      setConnectionError(true);
      setErrorMessage(
        error instanceof Error ? error.message : 'Connection failed'
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Select
        selectedKeys={[provider]}
        label="AI Provider"
        placeholder="Select AI provider"
        className="max-w-full"
        onSelectionChange={onAiProviderSelect}
      >
        <SelectItem key="openai">OpenAI ChatGPT</SelectItem>
        <SelectItem key="google">Google Gemini</SelectItem>
        <SelectItem key="ollama">Ollama</SelectItem>
        <SelectItem key="deepseek">DeepSeek</SelectItem>
      </Select>
      <Select
        label="LLM Model"
        placeholder="Select LLM model"
        className="max-w-full"
        onSelectionChange={onLLMModelSelect}
        isInvalid={!defaultProviderModels[provider].includes(model)}
        selectedKeys={model ? [model] : []}
      >
        {defaultProviderModels[provider].map((model) => (
          <SelectItem key={model}>{model}</SelectItem>
        ))}
      </Select>
      {connectionError && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
      {provider !== 'ollama' ? (
        <Input
          type="string"
          label="API Key"
          defaultValue="Enter your OpenAI key here"
          className="max-w-full"
          onChange={onApiKeyChange}
          value={apiKey || ''}
          required
          isInvalid={connectionError || apiKey.length === 0}
        />
      ) : (
        <Input
          type="string"
          label="Base URL"
          defaultValue="http://127.0.0.1:11434"
          placeholder="Enter your Ollama API URL here"
          className="max-w-full"
          required
          onChange={onBaseUrlChange}
        />
      )}
      {props.showParameters && (
        <>
          <Slider
            label="Temperature"
            step={0.1}
            maxValue={2}
            minValue={0}
            defaultValue={1.0}
            value={temperature}
            className="max-w-full"
            onChange={onTemperatureChange}
          />
          <Slider
            label="Top P"
            step={0.1}
            maxValue={1}
            minValue={0}
            defaultValue={0.8}
            value={topP}
            className="max-w-full"
            onChange={onTopPChange}
          />
        </>
      )}
      <Button
        isLoading={isRunning}
        onClick={onStartChat}
        className="mt-4"
        color={props.color || 'primary'}
      >
        Start Chat
      </Button>
    </div>
  );
}
