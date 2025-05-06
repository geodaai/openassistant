# Function: GetAssistantModelByProvider()

> **GetAssistantModelByProvider**(`options`): *typeof* [`VercelAi`](../classes/VercelAi.md) \| *typeof* [`OpenAIAssistant`](../classes/OpenAIAssistant.md) \| *typeof* [`DeepSeekAssistant`](../classes/DeepSeekAssistant.md) \| *typeof* [`GoogleAIAssistant`](../classes/GoogleAIAssistant.md) \| *typeof* [`XaiAssistant`](../classes/XaiAssistant.md) \| *typeof* [`OllamaAssistant`](../classes/OllamaAssistant.md) \| *typeof* `AnthropicAssistant`

Defined in: [packages/core/src/lib/model-utils.ts:40](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/lib/model-utils.ts#L40)

Returns the appropriate Assistant model based on the provider. (Internal use)

## Parameters

### options

The options object

#### chatEndpoint?

`string`

The chat endpoint that handles the chat requests, e.g. '/api/chat'. This is required for server-side support.

#### provider?

`string`

The name of the AI provider. The supported providers are: 'openai', 'anthropic', 'google', 'deepseek', 'xai', 'ollama'

## Returns

*typeof* [`VercelAi`](../classes/VercelAi.md) \| *typeof* [`OpenAIAssistant`](../classes/OpenAIAssistant.md) \| *typeof* [`DeepSeekAssistant`](../classes/DeepSeekAssistant.md) \| *typeof* [`GoogleAIAssistant`](../classes/GoogleAIAssistant.md) \| *typeof* [`XaiAssistant`](../classes/XaiAssistant.md) \| *typeof* [`OllamaAssistant`](../classes/OllamaAssistant.md) \| *typeof* `AnthropicAssistant`

The assistant model class.

## Example

```tsx
import { GetAssistantModelByProvider } from '@openassistant/core';

const AssistantModel = GetAssistantModelByProvider({
  provider: 'openai',
});

// configure the assistant model
AssistantModel.configure({
  apiKey: 'your-api-key',
  model: 'gpt-4o',
});

// initialize the assistant model
const assistant = await AssistantModel.getInstance();

// send a message to the assistant
const result = await assistant.processTextMessage({
  text: 'Hello, world!',
});
```
