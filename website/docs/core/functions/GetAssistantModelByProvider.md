# Function: GetAssistantModelByProvider()

> **GetAssistantModelByProvider**(`__namedParameters`): *typeof* [`VercelAi`](../classes/VercelAi.md) \| *typeof* [`OpenAIAssistant`](../classes/OpenAIAssistant.md) \| *typeof* [`DeepSeekAssistant`](../classes/DeepSeekAssistant.md) \| *typeof* [`GoogleAIAssistant`](../classes/GoogleAIAssistant.md) \| *typeof* [`XaiAssistant`](../classes/XaiAssistant.md) \| *typeof* [`OllamaAssistant`](../classes/OllamaAssistant.md)

Defined in: [lib/model-utils.ts:15](https://github.com/GeoDaCenter/openassistant/blob/d3d47c677c43fcc70dca2b232c88b920fa91a250/packages/core/src/lib/model-utils.ts#L15)

Returns the appropriate Assistant model based on the provider.

## Parameters

### \_\_namedParameters

#### chatEndpoint?

`string`

#### provider?

`string`

## Returns

*typeof* [`VercelAi`](../classes/VercelAi.md) \| *typeof* [`OpenAIAssistant`](../classes/OpenAIAssistant.md) \| *typeof* [`DeepSeekAssistant`](../classes/DeepSeekAssistant.md) \| *typeof* [`GoogleAIAssistant`](../classes/GoogleAIAssistant.md) \| *typeof* [`XaiAssistant`](../classes/XaiAssistant.md) \| *typeof* [`OllamaAssistant`](../classes/OllamaAssistant.md)

The assistant model class.
