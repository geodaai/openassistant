# Class: VercelAi

Defined in: [llm/vercelai.ts:105](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L105)

Vercel AI Assistant for Server only.

## Extends

- `AbstractAssistant`

## Extended by

- [`VercelAiClient`](VercelAiClient.md)

## Methods

### addAdditionalContext()

> **addAdditionalContext**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:190](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L190)

Add additional context to the conversation, so LLM can understand the context better

#### Parameters

##### \_\_namedParameters

###### context

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

`AbstractAssistant.addAdditionalContext`

***

### audioToText()

> **audioToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [llm/vercelai.ts:382](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L382)

audioToText method to use API endpoint for audio transcription

#### Parameters

##### audioBlob

[`AudioToTextProps`](../type-aliases/AudioToTextProps.md)

The audio blob to transcribe

#### Returns

`Promise`\<`string`\>

The transcribed text

#### Overrides

`AbstractAssistant.audioToText`

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [llm/assistant.ts:30](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/assistant.ts#L30)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractAssistant.close`

***

### processImageMessage()

> **processImageMessage**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:216](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L216)

Process image message

#### Parameters

##### \_\_namedParameters

[`ProcessImageMessageProps`](../type-aliases/ProcessImageMessageProps.md)

#### Returns

`Promise`\<`void`\>

#### Overrides

`AbstractAssistant.processImageMessage`

***

### processTextMessage()

> **processTextMessage**(`__namedParameters`): `Promise`\<\{ `messages`: `Message`[]; `outputToolCalls`: `undefined` \| `ToolCall`\<`string`, `unknown`\>[]; `outputToolResults`: `undefined` \| `ToolResultArray`\<`ToolSet`\>[]; \}\>

Defined in: [llm/vercelai.ts:228](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L228)

Process text message

#### Parameters

##### \_\_namedParameters

[`ProcessMessageProps`](../type-aliases/ProcessMessageProps.md)

#### Returns

`Promise`\<\{ `messages`: `Message`[]; `outputToolCalls`: `undefined` \| `ToolCall`\<`string`, `unknown`\>[]; `outputToolResults`: `undefined` \| `ToolResultArray`\<`ToolSet`\>[]; \}\>

#### Overrides

`AbstractAssistant.processTextMessage`

***

### restart()

> **restart**(): `void`

Defined in: [llm/vercelai.ts:205](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L205)

Restart the chat

#### Returns

`void`

#### Overrides

`AbstractAssistant.restart`

***

### setAbortController()

> **setAbortController**(`abortController`): `void`

Defined in: [llm/vercelai.ts:194](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L194)

#### Parameters

##### abortController

`AbortController`

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [llm/vercelai.ts:198](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L198)

Stop processing

#### Returns

`void`

#### Overrides

`AbstractAssistant.stop`

***

### translateVoiceToText()

> **translateVoiceToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [llm/assistant.ts:58](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/assistant.ts#L58)

Voice to text

#### Parameters

##### audioBlob

`Blob`

#### Returns

`Promise`\<`string`\>

#### Inherited from

`AbstractAssistant.translateVoiceToText`

***

### configure()

> `static` **configure**(`config`): `void`

Defined in: [llm/vercelai.ts:146](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L146)

Configure the LLM instance

#### Parameters

##### config

`VercelAiConfigureProps`

#### Returns

`void`

#### Overrides

`AbstractAssistant.configure`

***

### getBaseURL()

> `static` **getBaseURL**(): `void`

Defined in: [llm/vercelai.ts:210](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L210)

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`VercelAi`](VercelAi.md)\>

Defined in: [llm/vercelai.ts:136](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L136)

Get instance using singleton pattern

#### Returns

`Promise`\<[`VercelAi`](VercelAi.md)\>

#### Overrides

`AbstractAssistant.getInstance`

***

### registerFunctionCalling()

> `static` **registerFunctionCalling**(`__namedParameters`): `void`

Defined in: [llm/vercelai.ts:160](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L160)

Register custom function for function calling

#### Parameters

##### \_\_namedParameters

[`RegisterFunctionCallingProps`](../type-aliases/RegisterFunctionCallingProps.md)

#### Returns

`void`

#### Overrides

`AbstractAssistant.registerFunctionCalling`

***

### testConnection()

> `static` **testConnection**(`apiKey`, `model`): `Promise`\<`boolean`\>

Defined in: [llm/assistant.ts:93](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/assistant.ts#L93)

Test connection

#### Parameters

##### apiKey

`string`

##### model

`string`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`AbstractAssistant.testConnection`
