# Class: VercelAi

Defined in: [llm/vercelai.ts:95](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L95)

Vercel AI Assistant for Server only.

## Extends

- `AbstractAssistant`

## Extended by

- [`VercelAiClient`](VercelAiClient.md)

## Methods

### addAdditionalContext()

> **addAdditionalContext**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:174](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L174)

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

Defined in: [llm/vercelai.ts:341](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L341)

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

Defined in: [llm/assistant.ts:30](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/assistant.ts#L30)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractAssistant.close`

***

### processImageMessage()

> **processImageMessage**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:196](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L196)

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

> **processTextMessage**(`__namedParameters`): `Promise`\<\{ `messages`: `Message`[]; `outputToolCalls`: `undefined` \| `ToolCall`\<`string`, `unknown`\>[]; `outputToolResults`: `undefined` \| `ToolResult`\<`string`, `unknown`, `unknown`\>[]; \}\>

Defined in: [llm/vercelai.ts:208](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L208)

Process text message

#### Parameters

##### \_\_namedParameters

[`ProcessMessageProps`](../type-aliases/ProcessMessageProps.md)

#### Returns

`Promise`\<\{ `messages`: `Message`[]; `outputToolCalls`: `undefined` \| `ToolCall`\<`string`, `unknown`\>[]; `outputToolResults`: `undefined` \| `ToolResult`\<`string`, `unknown`, `unknown`\>[]; \}\>

#### Overrides

`AbstractAssistant.processTextMessage`

***

### restart()

> **restart**(): `void`

Defined in: [llm/vercelai.ts:185](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L185)

Restart the chat

#### Returns

`void`

#### Overrides

`AbstractAssistant.restart`

***

### stop()

> **stop**(): `void`

Defined in: [llm/vercelai.ts:178](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L178)

Stop processing

#### Returns

`void`

#### Overrides

`AbstractAssistant.stop`

***

### translateVoiceToText()

> **translateVoiceToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [llm/assistant.ts:58](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/assistant.ts#L58)

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

Defined in: [llm/vercelai.ts:130](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L130)

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

Defined in: [llm/vercelai.ts:190](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L190)

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`VercelAi`](VercelAi.md)\>

Defined in: [llm/vercelai.ts:120](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L120)

Get instance using singleton pattern

#### Returns

`Promise`\<[`VercelAi`](VercelAi.md)\>

#### Overrides

`AbstractAssistant.getInstance`

***

### registerFunctionCalling()

> `static` **registerFunctionCalling**(`__namedParameters`): `void`

Defined in: [llm/vercelai.ts:144](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L144)

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

Defined in: [llm/assistant.ts:93](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/assistant.ts#L93)

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
