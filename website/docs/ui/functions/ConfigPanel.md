# Function: ConfigPanel()

> **ConfigPanel**(`props`): `Element`

Defined in: [config-panel.tsx:116](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/ui/src/components/config-panel.tsx#L116)

The AI Assistant configuration panel.

This panel provides a select dropdown for the AI model from different AI providers, a text input for the API key,
(optional: showBaseUrl) a text input for the base URL,
(optional: showParameters) a slider for the temperature, and a slider for the top P.
(optional: showCheckConnectionButton) a button to check the connection and api key to the AI provider.
(optional: showErrorMessage) a message to show when the connection fails.

## Parameters

### props

`ConfigPanelProps`

## Returns

`Element`

## Examples

```tsx
import { ConfigPanel, MODEL_PROVIDERS } from '@openassistant/ui';

<ConfigPanel
 onConfigChange={handleConfigChange}
 defaultProviderModels={MODEL_PROVIDERS}
 initialConfig={initialConfig}
 showBaseUrl={true}
 showParameters={true}
 showCheckConnectionButton={true}
/>
```

The MODEL_PROVIDERS is a constant that contains the default models for each provider.
You can override the default models by providing a different object to the `defaultProviderModels` prop.
For example, if you only want to support the OpenAI models, you can do the following:

```tsx
const MY_PROVIDER_MODELS = {
 openai: {
   name: 'OpenAI',
   models: ['gpt-4.1', 'gpt-4o'],
 },
};

 <ConfigPanel
 onConfigChange={handleConfigChange}
 defaultProviderModels={MY_PROVIDER_MODELS}
 initialConfig={initialConfig}
 showBaseUrl={true}
 showParameters={true}
 showCheckConnectionButton={true}
/>
```
