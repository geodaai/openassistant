# Class: OpenAIAssistant

Defined in: [packages/core/src/llm/openai.ts:19](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/openai.ts#L19)

OpenAI Assistant LLM for Client only

## Extends

- [`VercelAiClient`](VercelAiClient.md)

## Properties

### llm

> **llm**: `null` \| `LanguageModelV1` = `null`

Defined in: [packages/core/src/llm/vercelai-client.ts:70](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai-client.ts#L70)

Language model instance

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`llm`](VercelAiClient.md#llm)

## Methods

### addMessage()

> **addMessage**(`message`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:195](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L195)

#### Parameters

##### message

`CoreMessage`

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`addMessage`](VercelAiClient.md#addmessage)

***

### audioToText()

> **audioToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [packages/core/src/llm/openai.ts:106](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/openai.ts#L106)

Override the audioToText method to use OpenAI Whisper

#### Parameters

##### audioBlob

[`AudioToTextProps`](../type-aliases/AudioToTextProps.md)

The audio blob to transcribe

#### Returns

`Promise`\<`string`\>

The transcribed text

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`audioToText`](VercelAiClient.md#audiototext)

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/core/src/llm/assistant.ts:27](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/assistant.ts#L27)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`close`](VercelAiClient.md#close)

***

### getComponents()

> **getComponents**(): [`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

Defined in: [packages/core/src/llm/vercelai.ts:203](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L203)

#### Returns

[`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`getComponents`](VercelAiClient.md#getcomponents)

***

### getMessages()

> **getMessages**(): `CoreMessage`[]

Defined in: [packages/core/src/llm/vercelai.ts:191](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L191)

#### Returns

`CoreMessage`[]

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`getMessages`](VercelAiClient.md#getmessages)

***

### processImageMessage()

> **processImageMessage**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/core/src/llm/vercelai.ts:241](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L241)

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

> **processTextMessage**(`__namedParameters`): `Promise`\<\{ `messages`: `CoreMessage`[]; `streamMessage`: [`StreamMessage`](../type-aliases/StreamMessage.md); \}\>

Defined in: [packages/core/src/llm/vercelai.ts:253](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L253)

Process text message

#### Parameters

##### \_\_namedParameters

[`ProcessMessageProps`](../type-aliases/ProcessMessageProps.md)

#### Returns

`Promise`\<\{ `messages`: `CoreMessage`[]; `streamMessage`: [`StreamMessage`](../type-aliases/StreamMessage.md); \}\>

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`processTextMessage`](VercelAiClient.md#processtextmessage)

***

### restart()

> **restart**(): `void`

Defined in: [packages/core/src/llm/openai.ts:93](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/openai.ts#L93)

Restarts the chat by clearing messages and resetting the LLM instance

#### Returns

`void`

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`restart`](VercelAiClient.md#restart)

***

### setAbortController()

> **setAbortController**(`abortController`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:219](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L219)

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

Defined in: [packages/core/src/llm/vercelai.ts:199](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L199)

#### Parameters

##### messages

`CoreMessage`[]

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`setMessages`](VercelAiClient.md#setmessages)

***

### stop()

> **stop**(): `void`

Defined in: [packages/core/src/llm/vercelai.ts:223](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L223)

Stop processing

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`stop`](VercelAiClient.md#stop)

***

### translateVoiceToText()

> **translateVoiceToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [packages/core/src/llm/assistant.ts:55](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/assistant.ts#L55)

Voice to text

#### Parameters

##### audioBlob

`Blob`

#### Returns

`Promise`\<`string`\>

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`translateVoiceToText`](VercelAiClient.md#translatevoicetotext)

***

### addToolResult()

> `static` **addToolResult**(`toolCallId`, `additionalData`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:183](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L183)

#### Parameters

##### toolCallId

`string`

##### additionalData

`unknown`

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`addToolResult`](VercelAiClient.md#addtoolresult)

***

### configure()

> `static` **configure**(`config`): `void`

Defined in: [packages/core/src/llm/openai.ts:32](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/openai.ts#L32)

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

Defined in: [packages/core/src/llm/openai.ts:28](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/openai.ts#L28)

Gets the base URL for API requests

#### Returns

`string`

#### Throws

Always throws as this is an abstract class

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`getBaseURL`](VercelAiClient.md#getbaseurl)

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`OpenAIAssistant`](OpenAIAssistant.md)\>

Defined in: [packages/core/src/llm/openai.ts:81](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/openai.ts#L81)

Get instance using singleton pattern

#### Returns

`Promise`\<[`OpenAIAssistant`](OpenAIAssistant.md)\>

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`getInstance`](VercelAiClient.md#getinstance)

***

### getToolResult()

> `static` **getToolResult**(`toolCallId`): `unknown`

Defined in: [packages/core/src/llm/vercelai.ts:187](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L187)

#### Parameters

##### toolCallId

`string`

#### Returns

`unknown`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`getToolResult`](VercelAiClient.md#gettoolresult)

***

### registerTool()

> `static` **registerTool**(`__namedParameters`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:174](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L174)

#### Parameters

##### \_\_namedParameters

[`RegisterToolProps`](../type-aliases/RegisterToolProps.md)

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`registerTool`](VercelAiClient.md#registertool)

***

### testConnection()

> `static` **testConnection**(`apiKey`, `model`): `Promise`\<`boolean`\>

Defined in: [packages/core/src/llm/openai.ts:37](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/openai.ts#L37)

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
