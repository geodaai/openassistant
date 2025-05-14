# Interface: VercelAiClientConfigureProps

Defined in: [packages/core/src/llm/vercelai-client.ts:25](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L25)

Configuration properties for VercelAiClient

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:27](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L27)

API key for authentication

***

### baseURL?

> `optional` **baseURL**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:43](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L43)

Base URL for API requests

***

### description?

> `optional` **description**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:37](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L37)

Description of the assistant

***

### instructions?

> `optional` **instructions**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:31](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L31)

System instructions for the model

***

### maxSteps?

> `optional` **maxSteps**: `number`

Defined in: [packages/core/src/llm/vercelai-client.ts:47](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L47)

Maximum number of tool call steps

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/core/src/llm/vercelai-client.ts:41](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L41)

Maximum tokens to generate

***

### model?

> `optional` **model**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:29](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L29)

Model name to use

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/core/src/llm/vercelai-client.ts:33](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L33)

Temperature for controlling randomness (0-1)

***

### toolCallStreaming?

> `optional` **toolCallStreaming**: `boolean`

Defined in: [packages/core/src/llm/vercelai-client.ts:49](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L49)

Tool call streaming

***

### toolChoice?

> `optional` **toolChoice**: `ToolChoice`\<`ToolSet`\>

Defined in: [packages/core/src/llm/vercelai-client.ts:45](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L45)

Tool choice configuration

***

### topP?

> `optional` **topP**: `number`

Defined in: [packages/core/src/llm/vercelai-client.ts:35](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L35)

Top P sampling parameter (0-1)

***

### version?

> `optional` **version**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:39](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L39)

Version of the model
