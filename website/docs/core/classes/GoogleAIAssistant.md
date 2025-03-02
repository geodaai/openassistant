# Class: GoogleAIAssistant

Defined in: [llm/google.ts:16](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/google.ts#L16)

Google Gemini Assistant LLM for Client only

## Extends

- [`VercelAiClient`](VercelAiClient.md)

## Properties

### llm

> **llm**: `null` \| `LanguageModelV1` = `null`

Defined in: [llm/vercelai-client.ts:78](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai-client.ts#L78)

Language model instance

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`llm`](VercelAiClient.md#llm)

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

[`VercelAiClient`](VercelAiClient.md).[`addAdditionalContext`](VercelAiClient.md#addadditionalcontext)

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

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`audioToText`](VercelAiClient.md#audiototext)

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [llm/assistant.ts:30](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/assistant.ts#L30)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`close`](VercelAiClient.md#close)

***

### getMessages()

> **getMessages**(): `Message`[]

Defined in: [llm/vercelai.ts:195](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L195)

#### Returns

`Message`[]

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`getMessages`](VercelAiClient.md#getmessages)

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

[`VercelAiClient`](VercelAiClient.md).[`processImageMessage`](VercelAiClient.md#processimagemessage)

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

[`VercelAiClient`](VercelAiClient.md).[`processTextMessage`](VercelAiClient.md#processtextmessage)

***

### restart()

> **restart**(): `void`

Defined in: [llm/google.ts:65](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/google.ts#L65)

Restarts the chat by clearing messages and resetting the LLM instance

#### Returns

`void`

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`restart`](VercelAiClient.md#restart)

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

[`VercelAiClient`](VercelAiClient.md).[`setAbortController`](VercelAiClient.md#setabortcontroller)

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

[`VercelAiClient`](VercelAiClient.md).[`setMessages`](VercelAiClient.md#setmessages)

***

### stop()

> **stop**(): `void`

Defined in: [llm/vercelai.ts:211](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L211)

Stop processing

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`stop`](VercelAiClient.md#stop)

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

[`VercelAiClient`](VercelAiClient.md).[`translateVoiceToText`](VercelAiClient.md#translatevoicetotext)

***

### configure()

> `static` **configure**(`config`): `void`

Defined in: [llm/google.ts:27](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/google.ts#L27)

Configures the client with the provided settings

#### Parameters

##### config

[`VercelAiClientConfigureProps`](../interfaces/VercelAiClientConfigureProps.md)

Configuration options

#### Returns

`void`

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`configure`](VercelAiClient.md#configure)

***

### getBaseURL()

> `abstract` `static` **getBaseURL**(): `string`

Defined in: [llm/google.ts:23](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/google.ts#L23)

Gets the base URL for API requests

#### Returns

`string`

#### Throws

Always throws as this is an abstract class

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`getBaseURL`](VercelAiClient.md#getbaseurl)

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`GoogleAIAssistant`](GoogleAIAssistant.md)\>

Defined in: [llm/google.ts:58](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/google.ts#L58)

Get instance using singleton pattern

#### Returns

`Promise`\<[`GoogleAIAssistant`](GoogleAIAssistant.md)\>

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`getInstance`](VercelAiClient.md#getinstance)

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

[`VercelAiClient`](VercelAiClient.md).[`registerFunctionCalling`](VercelAiClient.md#registerfunctioncalling)

***

### testConnection()

> `static` **testConnection**(`apiKey`, `model`): `Promise`\<`boolean`\>

Defined in: [llm/google.ts:32](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/google.ts#L32)

Test connection

#### Parameters

##### apiKey

`string`

##### model

`string`

#### Returns

`Promise`\<`boolean`\>

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`testConnection`](VercelAiClient.md#testconnection)
