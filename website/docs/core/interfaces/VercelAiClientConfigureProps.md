# Interface: VercelAiClientConfigureProps

Defined in: [packages/core/src/llm/vercelai-client.ts:33](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L33)

Configuration properties for VercelAiClient

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:35](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L35)

API key for authentication

***

### baseURL?

> `optional` **baseURL**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:51](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L51)

Base URL for API requests

***

### description?

> `optional` **description**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:45](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L45)

Description of the assistant

***

### instructions?

> `optional` **instructions**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:39](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L39)

System instructions for the model

***

### maxSteps?

> `optional` **maxSteps**: `number`

Defined in: [packages/core/src/llm/vercelai-client.ts:55](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L55)

Maximum number of tool call steps

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/core/src/llm/vercelai-client.ts:49](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L49)

Maximum tokens to generate

***

### model?

> `optional` **model**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:37](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L37)

Model name to use

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/core/src/llm/vercelai-client.ts:41](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L41)

Temperature for controlling randomness (0-1)

***

### toolCallStreaming?

> `optional` **toolCallStreaming**: `boolean`

Defined in: [packages/core/src/llm/vercelai-client.ts:57](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L57)

Tool call streaming

***

### toolChoice?

> `optional` **toolChoice**: `ToolChoice`\<`ToolSet`\>

Defined in: [packages/core/src/llm/vercelai-client.ts:53](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L53)

Tool choice configuration

***

### topP?

> `optional` **topP**: `number`

Defined in: [packages/core/src/llm/vercelai-client.ts:43](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L43)

Top P sampling parameter (0-1)

***

### version?

> `optional` **version**: `string`

Defined in: [packages/core/src/llm/vercelai-client.ts:47](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/llm/vercelai-client.ts#L47)

Version of the model
