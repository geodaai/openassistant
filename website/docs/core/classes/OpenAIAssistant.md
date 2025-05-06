# Class: OpenAIAssistant

Defined in: [packages/core/src/llm/openai.ts:19](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/openai.ts#L19)

OpenAI Assistant LLM for Client only

## Extends

- [`VercelAiClient`](VercelAiClient.md)

## Properties

### llm

> **llm**: `null` \| `LanguageModelV1` = `null`

Defined in: [packages/core/src/llm/vercelai-client.ts:78](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/vercelai-client.ts#L78)

Language model instance

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`llm`](VercelAiClient.md#llm)

## Methods

### addAdditionalContext()

> **addAdditionalContext**(`props`): `Promise`\<`void`\>

Defined in: [packages/core/src/llm/assistant.ts:90](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/assistant.ts#L90)

Add additional context to the conversation, so LLM can understand the context better

#### Parameters

##### props

###### callback?

() => `void`

###### context

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`addAdditionalContext`](VercelAiClient.md#addadditionalcontext)

***

### addMessage()

> **addMessage**(`message`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:245](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/vercelai.ts#L245)

#### Parameters

##### message

[`AIMessage`](../type-aliases/AIMessage.md)

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`addMessage`](VercelAiClient.md#addmessage)

***

### audioToText()

> **audioToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [packages/core/src/llm/openai.ts:106](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/openai.ts#L106)

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

Defined in: [packages/core/src/llm/assistant.ts:28](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/assistant.ts#L28)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`close`](VercelAiClient.md#close)

***

### getComponents()

> **getComponents**(): [`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

Defined in: [packages/core/src/llm/vercelai.ts:253](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/vercelai.ts#L253)

#### Returns

[`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`getComponents`](VercelAiClient.md#getcomponents)

***

### getMessages()

> **getMessages**(): [`AIMessage`](../type-aliases/AIMessage.md)[]

Defined in: [packages/core/src/llm/vercelai.ts:241](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/vercelai.ts#L241)

#### Returns

[`AIMessage`](../type-aliases/AIMessage.md)[]

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`getMessages`](VercelAiClient.md#getmessages)

***

### processImageMessage()

> **processImageMessage**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/core/src/llm/vercelai.ts:300](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/vercelai.ts#L300)

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

> **processTextMessage**(`__namedParameters`): `Promise`\<\{ `messages`: [`AIMessage`](../type-aliases/AIMessage.md)[]; \}\>

Defined in: [packages/core/src/llm/vercelai.ts:322](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/vercelai.ts#L322)

Process the text message by sending it to the LLM.

#### Parameters

##### \_\_namedParameters

[`ProcessMessageProps`](../type-aliases/ProcessMessageProps.md)

#### Returns

`Promise`\<\{ `messages`: [`AIMessage`](../type-aliases/AIMessage.md)[]; \}\>

Promise containing the newly added message

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`processTextMessage`](VercelAiClient.md#processtextmessage)

***

### restart()

> **restart**(): `void`

Defined in: [packages/core/src/llm/openai.ts:93](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/openai.ts#L93)

Restarts the chat by clearing messages and resetting the LLM instance

#### Returns

`void`

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`restart`](VercelAiClient.md#restart)

***

### setAbortController()

> **setAbortController**(`abortController`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:278](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/vercelai.ts#L278)

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

Defined in: [packages/core/src/llm/vercelai.ts:249](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/vercelai.ts#L249)

#### Parameters

##### messages

[`AIMessage`](../type-aliases/AIMessage.md)[]

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`setMessages`](VercelAiClient.md#setmessages)

***

### stop()

> **stop**(): `void`

Defined in: [packages/core/src/llm/vercelai.ts:282](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/vercelai.ts#L282)

Stop processing

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`stop`](VercelAiClient.md#stop)

***

### translateVoiceToText()

> **translateVoiceToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [packages/core/src/llm/assistant.ts:56](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/assistant.ts#L56)

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

Defined in: [packages/core/src/llm/openai.ts:32](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/openai.ts#L32)

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

Defined in: [packages/core/src/llm/openai.ts:28](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/openai.ts#L28)

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

Defined in: [packages/core/src/llm/openai.ts:81](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/openai.ts#L81)

Get instance using singleton pattern

#### Returns

`Promise`\<[`OpenAIAssistant`](OpenAIAssistant.md)\>

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`getInstance`](VercelAiClient.md#getinstance)

***

### registerFunctionCalling()

> `static` **registerFunctionCalling**(`__namedParameters`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:208](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/vercelai.ts#L208)

Register custom function for function calling

#### Parameters

##### \_\_namedParameters

[`RegisterFunctionCallingProps`](../type-aliases/RegisterFunctionCallingProps.md)

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`registerFunctionCalling`](VercelAiClient.md#registerfunctioncalling)

***

### registerTool()

> `static` **registerTool**(`__namedParameters`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:192](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/vercelai.ts#L192)

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

Defined in: [packages/core/src/llm/openai.ts:37](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/llm/openai.ts#L37)

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
