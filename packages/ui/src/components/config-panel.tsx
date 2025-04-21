import {
  Button,
  Input,
  SelectItem,
  SelectSection,
  Slider,
} from '@nextui-org/react';
import { Select } from '@nextui-org/react';
import { GetAssistantModelByProvider } from '@openassistant/core';
import { ChangeEvent, useState } from 'react';
import { MODEL_PROVIDERS } from '../config/constants';
import { Icon } from '@iconify/react';

// Add a type for valid providers
type Provider = keyof typeof MODEL_PROVIDERS;

/**
 * The configuration for the AI Assistant.
 */
export type AiAssistantConfig = {
  /** Whether the AI Assistant is ready to use. */
  isReady: boolean;
  /** The AI provider. */
  provider: Provider;
  /** The AI model. */
  model: string;
  /** The API key for the AI provider. */
  apiKey: string;
  /** The temperature for the AI model. */
  temperature: number;
  /** The top P for the AI model. */
  topP: number;
  /** The base URL for the AI provider. */
  baseUrl?: string;
};

/**
 * The props for the ConfigPanel component.
 */
export type ConfigPanelProps = {
  /** The default models for each provider. */
  defaultProviderModels?: Record<Provider, { name: string; models: string[] }>;
  /** The initial configuration for the AI Assistant. */
  initialConfig?: AiAssistantConfig;
  /** Whether to show the start chat button. */
  showStartChatButton?: boolean;
  /** Whether to show the parameters. */
  showParameters?: boolean;
  /** The color of the button. */
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  /** The function to call when the configuration changes. */
  onConfigChange: (config: AiAssistantConfig) => void;
  /** The connection timeout. */
  connectionTimeout?: number;
  /** Whether to show the error message. */
  showErrorMessage?: boolean;
  /** Whether to show the base URL. */
  showBaseUrl?: boolean;
  /** Whether to show the check connection button. */
  showCheckConnectionButton?: boolean;
};

/**
 * The AI Assistant configuration panel.
 *
 * This panel provides a select dropdown for the AI model from different AI providers, a text input for the API key,
 * (optional: showBaseUrl) a text input for the base URL,
 * (optional: showParameters) a slider for the temperature, and a slider for the top P.
 * (optional: showCheckConnectionButton) a button to check the connection and api key to the AI provider.
 * (optional: showErrorMessage) a message to show when the connection fails.
 *
 * @example
 *  ```tsx
 * import { ConfigPanel, MODEL_PROVIDERS } from '@openassistant/ui';
 *
 * <ConfigPanel
 *  onConfigChange={handleConfigChange}
 *  defaultProviderModels={MODEL_PROVIDERS}
 *  initialConfig={initialConfig}
 *  showBaseUrl={true}
 *  showParameters={true}
 *  showCheckConnectionButton={true}
 * />
 * ```
 *
 * The MODEL_PROVIDERS is a constant that contains the default models for each provider.
 * You can override the default models by providing a different object to the `defaultProviderModels` prop.
 * For example, if you only want to support the OpenAI models, you can do the following:
 *
 * @example
 *  ```tsx
 * const MY_PROVIDER_MODELS = {
 *  openai: {
 *    name: 'OpenAI',
 *    models: ['gpt-4.1', 'gpt-4o'],
 *  },
 * };
 *
 *  <ConfigPanel
 *  onConfigChange={handleConfigChange}
 *  defaultProviderModels={MY_PROVIDER_MODELS}
 *  initialConfig={initialConfig}
 *  showBaseUrl={true}
 *  showParameters={true}
 *  showCheckConnectionButton={true}
 * />
 * ```
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
  const [keyError, setKeyError] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const generateConfig = (
    overrides: Partial<AiAssistantConfig> = {}
  ): AiAssistantConfig => ({
    provider,
    model,
    apiKey,
    isReady: false,
    temperature,
    topP,
    ...(baseUrl && { baseUrl }),
    ...overrides,
  });

  const onLLMModelSelect = (
    value: string | number | boolean | object | null
  ) => {
    if (value && typeof value === 'object' && 'currentKey' in value) {
      const selectedModel = value.currentKey as string;
      setModel(selectedModel);
      // find the provider for the selected model
      const selectedProvider = Object.keys(MODEL_PROVIDERS).find((p) =>
        MODEL_PROVIDERS[p].models.includes(selectedModel)
      );
      if (selectedProvider && selectedProvider !== provider) {
        setProvider(selectedProvider as Provider);
        setBaseUrl(undefined);
        setConnectionError(false);
        setErrorMessage('');
      }
    }
  };

  const onApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setApiKey(inputValue);
    // reset previous key error if any
    setConnectionError(false);
    setErrorMessage('');
    setKeyError(true);

    props.onConfigChange?.(generateConfig({ apiKey: inputValue }));
  };

  const onTemperatureChange = (value: number | number[]) => {
    const temperatureValue = typeof value === 'number' ? value : value[0];
    setTemperature(temperatureValue);

    props.onConfigChange?.(generateConfig({ temperature: temperatureValue }));
  };

  const onTopPChange = (value: number | number[]) => {
    const topPValue = typeof value === 'number' ? value : value[0];
    setTopP(topPValue);

    props.onConfigChange?.(generateConfig({ topP: topPValue }));
  };

  const onBaseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setBaseUrl(inputValue);
    setConnectionError(false);
    setErrorMessage('');

    props.onConfigChange?.(generateConfig({ baseUrl: inputValue }));
  };

  const AssistantModel = GetAssistantModelByProvider({
    provider: provider,
  });

  const headingClasses =
    'flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small';

  const isOllama = provider === 'ollama';

  const onCheckConnection = async () => {
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
        ? isOllama
          ? 'Connection failed: maybe invalid Ollama Base URL'
          : 'Connection failed: maybe invalid API Key'
        : '';

      setKeyError(!success);
      setConnectionError(!success);
      setErrorMessage(errorMessage);
      props.onConfigChange?.(generateConfig({ isReady: success }));
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
        label="AI Model"
        placeholder="Select AI model"
        className="max-w-full"
        onSelectionChange={onLLMModelSelect}
        selectedKeys={[model]}
      >
        {Object.keys(MODEL_PROVIDERS).map((provider) => (
          <SelectSection
            key={provider}
            classNames={{ heading: headingClasses }}
            title={MODEL_PROVIDERS[provider].name}
          >
            {MODEL_PROVIDERS[provider].models.map((model) => (
              <SelectItem key={model}>{model}</SelectItem>
            ))}
          </SelectSection>
        ))}
      </Select>
      {connectionError && props.showErrorMessage && (
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
        endContent={
          !keyError && <Icon icon="mdi:check" className="text-green-500" />
        }
      />
      {isOllama && props.showBaseUrl && (
        <Input
          type="string"
          label="Base URL"
          value={baseUrl || AssistantModel?.getBaseURL() || ''}
          placeholder="Enter base URL here"
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
      {props.showCheckConnectionButton && (
        <Button
          isLoading={isRunning}
          onPress={onCheckConnection}
          className="mt-4"
          color={props.color || 'primary'}
          isDisabled={model.length === 0 || apiKey.length === 0}
        >
          Check Connection
        </Button>
      )}
    </div>
  );
}
