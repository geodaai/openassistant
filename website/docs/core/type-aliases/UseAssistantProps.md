# Type Alias: UseAssistantProps

> **UseAssistantProps**: `object`

Defined in: [packages/core/src/hooks/use-assistant.ts:13](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/hooks/use-assistant.ts#L13)

Props for configuring the AI Assistant and useAssistant hook.

## Type declaration

### abortController?

> `optional` **abortController**: `AbortController`

Optional AbortController to cancel requests.

### apiKey

> **apiKey**: `string`

The authentication key/token for the model provider's API. For example, [how to get the OpenAI API key](https://platform.openai.com/api-keys).

### baseUrl?

> `optional` **baseUrl**: `string`

Optional base URL for API requests.

### chatEndpoint?

> `optional` **chatEndpoint**: `string`

The server endpoint for handling chat requests (e.g. '/api/chat'). Required for server-side support.

### description?

> `optional` **description**: `string`

Optional description of the assistant's purpose.

### historyMessages?

> `optional` **historyMessages**: `Message`[]

The history of messages exchanged with the assistant.

### instructions

> **instructions**: `string`

System instructions/prompt for the assistant.

### maxSteps?

> `optional` **maxSteps**: `number`

Maximum number of steps/iterations in a conversation.

### model

> **model**: `string`

The specific model identifier to use:

- openai [models](https://sdk.vercel.ai/providers/ai-sdk-providers/openai#model-capabilities)
- anthropic [models](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#model-capabilities)
- google [models](https://sdk.vercel.ai/providers/ai-sdk-providers/google#model-capabilities)
- deepseek [models](https://sdk.vercel.ai/providers/ai-sdk-providers/deepseek#model-capabilities)
- xai [models](https://sdk.vercel.ai/providers/ai-sdk-providers/xai#model-capabilities)
- ollama [models](https://ollama.com/models)

### modelProvider

> **modelProvider**: `string`

The AI model provider:

- openai
- anthropic
- google
- deepseek
- xai
- ollama

### name

> **name**: `string`

The display name of the assistant.

### temperature?

> `optional` **temperature**: `number`

Controls randomness in responses (0-1).

### toolCallStreaming?

> `optional` **toolCallStreaming**: `boolean`

Whether to stream tool calls.

### toolChoice?

> `optional` **toolChoice**: `ToolChoice`\<`ToolSet`\>

Controls how the assistant selects tools to use.

### tools?

> `optional` **tools**: `Record`\<`string`, `ExtendedTool`\<`any`, `any`, `any`, `any`\> \| `Tool`\>

Custom tools the assistant can use. E.g. `{ localQuery: localQueryTool }`

### topP?

> `optional` **topP**: `number`

Controls diversity of responses via nucleus sampling (0-1).

### version?

> `optional` **version**: `string`

Optional API version to use.

### voiceEndpoint?

> `optional` **voiceEndpoint**: `string`

The server endpoint for handling voice/audio requests.
