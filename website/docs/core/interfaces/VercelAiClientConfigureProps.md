# Interface: VercelAiClientConfigureProps

Defined in: [llm/vercelai-client.ts:35](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L35)

Configuration properties for VercelAiClient

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [llm/vercelai-client.ts:37](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L37)

API key for authentication

***

### baseURL?

> `optional` **baseURL**: `string`

Defined in: [llm/vercelai-client.ts:53](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L53)

Base URL for API requests

***

### description?

> `optional` **description**: `string`

Defined in: [llm/vercelai-client.ts:47](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L47)

Description of the assistant

***

### instructions?

> `optional` **instructions**: `string`

Defined in: [llm/vercelai-client.ts:41](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L41)

System instructions for the model

***

### maxSteps?

> `optional` **maxSteps**: `number`

Defined in: [llm/vercelai-client.ts:57](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L57)

Maximum number of tool call steps

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [llm/vercelai-client.ts:51](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L51)

Maximum tokens to generate

***

### model?

> `optional` **model**: `string`

Defined in: [llm/vercelai-client.ts:39](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L39)

Model name to use

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [llm/vercelai-client.ts:43](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L43)

Temperature for controlling randomness (0-1)

***

### toolChoice?

> `optional` **toolChoice**: `ToolChoice`\<`ToolSet`\>

Defined in: [llm/vercelai-client.ts:55](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L55)

Tool choice configuration

***

### topP?

> `optional` **topP**: `number`

Defined in: [llm/vercelai-client.ts:45](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L45)

Top P sampling parameter (0-1)

***

### version?

> `optional` **version**: `string`

Defined in: [llm/vercelai-client.ts:49](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/llm/vercelai-client.ts#L49)

Version of the model
