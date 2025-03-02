# Class: `abstract` VercelAiClient

Defined in: [llm/vercelai-client.ts:67](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai-client.ts#L67)

Abstract Vercel AI Client for client-side usage. Extends the VercelAi class to handle
LLM interactions directly from the browser using Vercel AI SDK instead of API endpoints.

## Extends

- [`VercelAi`](VercelAi.md)

## Extended by

- [`OpenAIAssistant`](OpenAIAssistant.md)
- [`DeepSeekAssistant`](DeepSeekAssistant.md)
- [`GoogleAIAssistant`](GoogleAIAssistant.md)
- [`XaiAssistant`](XaiAssistant.md)
- [`OllamaAssistant`](OllamaAssistant.md)

## Properties

### llm

> **llm**: `null` \| `LanguageModelV1` = `null`

Defined in: [llm/vercelai-client.ts:78](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai-client.ts#L78)

Language model instance

## Methods

### addAdditionalContext()

> **addAdditionalContext**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:203](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L203)

Add additional context to the conversation, so LLM can understand the context better

#### Parameters

##### \_\_namedParameters

###### context

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`addAdditionalContext`](VercelAi.md#addadditionalcontext)

***

### audioToText()

> **audioToText**(`params`): `Promise`\<`string`\>

Defined in: [llm/vercelai-client.ts:464](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai-client.ts#L464)

Converts audio to text using the configured LLM

#### Parameters

##### params

[`AudioToTextProps`](../type-aliases/AudioToTextProps.md)

Audio conversion parameters

#### Returns

`Promise`\<`string`\>

Transcribed text

#### Throws

If LLM is not configured or audio blob is missing

#### Overrides

[`VercelAi`](VercelAi.md).[`audioToText`](VercelAi.md#audiototext)

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [llm/assistant.ts:30](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/assistant.ts#L30)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`close`](VercelAi.md#close)

***

### getMessages()

> **getMessages**(): `Message`[]

Defined in: [llm/vercelai.ts:195](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L195)

#### Returns

`Message`[]

#### Inherited from

[`VercelAi`](VercelAi.md).[`getMessages`](VercelAi.md#getmessages)

***

### processImageMessage()

> **processImageMessage**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:229](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L229)

Process image message

#### Parameters

##### \_\_namedParameters

[`ProcessImageMessageProps`](../type-aliases/ProcessImageMessageProps.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`processImageMessage`](VercelAi.md#processimagemessage)

***

### processTextMessage()

> **processTextMessage**(`__namedParameters`): `Promise`\<\{ `messages`: `Message`[]; \}\>

Defined in: [llm/vercelai.ts:250](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L250)

Process the text message by sending it to the LLM.

#### Parameters

##### \_\_namedParameters

[`ProcessMessageProps`](../type-aliases/ProcessMessageProps.md)

#### Returns

`Promise`\<\{ `messages`: `Message`[]; \}\>

The last message

#### Inherited from

[`VercelAi`](VercelAi.md).[`processTextMessage`](VercelAi.md#processtextmessage)

***

### restart()

> **restart**(): `void`

Defined in: [llm/vercelai-client.ts:143](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai-client.ts#L143)

Restarts the chat by clearing messages and resetting the LLM instance

#### Returns

`void`

#### Overrides

[`VercelAi`](VercelAi.md).[`restart`](VercelAi.md#restart)

***

### setAbortController()

> **setAbortController**(`abortController`): `void`

Defined in: [llm/vercelai.ts:207](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L207)

#### Parameters

##### abortController

`AbortController`

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`setAbortController`](VercelAi.md#setabortcontroller)

***

### setMessages()

> **setMessages**(`messages`): `void`

Defined in: [llm/vercelai.ts:199](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L199)

#### Parameters

##### messages

`Message`[]

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`setMessages`](VercelAi.md#setmessages)

***

### stop()

> **stop**(): `void`

Defined in: [llm/vercelai.ts:211](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L211)

Stop processing

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`stop`](VercelAi.md#stop)

***

### translateVoiceToText()

> **translateVoiceToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [llm/assistant.ts:58](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/assistant.ts#L58)

Voice to text

#### Parameters

##### audioBlob

`Blob`

#### Returns

`Promise`\<`string`\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`translateVoiceToText`](VercelAi.md#translatevoicetotext)

***

### configure()

> `static` **configure**(`config`): `void`

Defined in: [llm/vercelai-client.ts:126](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai-client.ts#L126)

Configures the client with the provided settings

#### Parameters

##### config

[`VercelAiClientConfigureProps`](../interfaces/VercelAiClientConfigureProps.md)

Configuration options

#### Returns

`void`

#### Overrides

[`VercelAi`](VercelAi.md).[`configure`](VercelAi.md#configure)

***

### getBaseURL()

> `abstract` `static` **getBaseURL**(): `void`

Defined in: [llm/vercelai-client.ts:88](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai-client.ts#L88)

Gets the base URL for API requests

#### Returns

`void`

#### Throws

Always throws as this is an abstract class

#### Overrides

[`VercelAi`](VercelAi.md).[`getBaseURL`](VercelAi.md#getbaseurl)

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`VercelAi`](VercelAi.md)\>

Defined in: [llm/vercelai.ts:141](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L141)

Get instance using singleton pattern

#### Returns

`Promise`\<[`VercelAi`](VercelAi.md)\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`getInstance`](VercelAi.md#getinstance)

***

### registerFunctionCalling()

> `static` **registerFunctionCalling**(`__namedParameters`): `void`

Defined in: [llm/vercelai.ts:165](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L165)

Register custom function for function calling

#### Parameters

##### \_\_namedParameters

[`RegisterFunctionCallingProps`](../type-aliases/RegisterFunctionCallingProps.md)

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`registerFunctionCalling`](VercelAi.md#registerfunctioncalling)

***

### testConnection()

> `static` **testConnection**(`apiKey`, `model`): `Promise`\<`boolean`\>

Defined in: [llm/assistant.ts:93](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/assistant.ts#L93)

Test connection

#### Parameters

##### apiKey

`string`

##### model

`string`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`testConnection`](VercelAi.md#testconnection)
