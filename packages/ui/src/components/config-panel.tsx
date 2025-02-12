import { Button, Input, SelectItem, Slider } from '@nextui-org/react';
import { Select } from '@nextui-org/react';
import {
  GetAssistantModelByProvider,
  VercelAiClient,
} from '@openassistant/core';
import { ChangeEvent, useState } from 'react';
import { MODEL_PROVIDERS } from '../config/constants';

// Add a type for valid providers
type Provider = keyof typeof MODEL_PROVIDERS;

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
  temperature: number;
  topP: number;
  baseUrl?: string;
};

/**
 * The props for the ConfigPanel component.
 *
 * @property {Record<string, string[]>} defaultProviderModels - The default models for each provider.
 * @property {AiAssistantConfig} initialConfig - The initial configuration for the AI Assistant.
 * @property {function} onConfigChange - The function to call when the configuration changes.
 */
export type ConfigPanelProps = {
  defaultProviderModels?: Record<Provider, { name: string; models: string[] }>;
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
  connectionTimeout?: number;
};

/**
 * The AI Assistant configuration panel.
 *
 * @param props - The props for the ConfigPanel component. See {@link ConfigPanelProps} for more information.
 * @returns {JSX.Element} The rendered ConfigPanel component.
 */
export function ConfigPanel(props: ConfigPanelProps) {
  const defaultProviderModels = props.defaultProviderModels || MODEL_PROVIDERS;
  const connectionTimeout = props.connectionTimeout || 10000;
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
  const [baseUrl, setBaseUrl] = useState(props.initialConfig?.baseUrl);
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

  const AssistantModel = GetAssistantModelByProvider({
    provider: provider,
  }) as unknown as typeof VercelAiClient;

  const onStartChat = async () => {
    setIsRunning(true);
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error(`Connection timed out after ${connectionTimeout}ms`)
            ),
          connectionTimeout
        );
      });
      
      const success = (await Promise.race([
        AssistantModel?.testConnection(apiKey, model),
        timeoutPromise,
      ])) as boolean;

      const errorMessage = !success
        ? provider === 'ollama'
          ? 'Connection failed: maybe invalid Ollama Base URL'
          : 'Connection failed: maybe invalid API Key'
        : '';

      setConnectionError(!success);
      setErrorMessage(errorMessage);
      props.onConfigChange?.({
        provider: provider,
        model: model,
        apiKey: apiKey,
        isReady: success,
        temperature: temperature,
        topP: topP,
        ...(baseUrl && { baseUrl: baseUrl }),
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
        {Object.keys(MODEL_PROVIDERS).map((provider) => (
          <SelectItem key={provider}>
            {MODEL_PROVIDERS[provider].name}
          </SelectItem>
        ))}
      </Select>
      <Select
        label="LLM Model"
        placeholder="Select LLM model"
        className="max-w-full"
        onSelectionChange={onLLMModelSelect}
        isInvalid={!defaultProviderModels[provider].models.includes(model)}
        selectedKeys={model ? [model] : []}
      >
        {defaultProviderModels[provider].models.map((model) => (
          <SelectItem key={model}>{model}</SelectItem>
        ))}
      </Select>
      {connectionError && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
      <Input
        type="string"
        label="API Key"
        defaultValue="Enter your API token here"
        className="max-w-full"
        onChange={onApiKeyChange}
        value={apiKey || ''}
        required
        isInvalid={connectionError || apiKey.length === 0}
      />
      <Input
        type="string"
        label="Base URL"
        defaultValue={baseUrl || AssistantModel?.getBaseURL() || ''}
        placeholder="Enter base URL here"
        className="max-w-full"
        required
        onChange={onBaseUrlChange}
      />
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
