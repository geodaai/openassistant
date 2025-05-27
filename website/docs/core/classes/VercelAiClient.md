# Class: `abstract` VercelAiClient

Defined in: [packages/core/src/llm/vercelai-client.ts:55](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai-client.ts#L55)

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

Defined in: [packages/core/src/llm/vercelai-client.ts:66](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai-client.ts#L66)

Language model instance

## Methods

### addMessage()

> **addMessage**(`message`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:193](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L193)

#### Parameters

##### message

`CoreMessage`

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`addMessage`](VercelAi.md#addmessage)

***

### audioToText()

> **audioToText**(`params`): `Promise`\<`string`\>

Defined in: [packages/core/src/llm/vercelai-client.ts:393](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai-client.ts#L393)

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

Defined in: [packages/core/src/llm/assistant.ts:27](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/assistant.ts#L27)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`close`](VercelAi.md#close)

***

### getComponents()

> **getComponents**(): [`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

Defined in: [packages/core/src/llm/vercelai.ts:201](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L201)

#### Returns

[`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

#### Inherited from

[`VercelAi`](VercelAi.md).[`getComponents`](VercelAi.md#getcomponents)

***

### getMessages()

> **getMessages**(): `CoreMessage`[]

Defined in: [packages/core/src/llm/vercelai.ts:189](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L189)

#### Returns

`CoreMessage`[]

#### Inherited from

[`VercelAi`](VercelAi.md).[`getMessages`](VercelAi.md#getmessages)

***

### processImageMessage()

> **processImageMessage**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/core/src/llm/vercelai.ts:239](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L239)

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

> **processTextMessage**(`__namedParameters`): `Promise`\<\{ `messages`: `CoreMessage`[]; `streamMessage`: [`StreamMessage`](../type-aliases/StreamMessage.md); \}\>

Defined in: [packages/core/src/llm/vercelai.ts:251](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L251)

Process text message

#### Parameters

##### \_\_namedParameters

[`ProcessMessageProps`](../type-aliases/ProcessMessageProps.md)

#### Returns

`Promise`\<\{ `messages`: `CoreMessage`[]; `streamMessage`: [`StreamMessage`](../type-aliases/StreamMessage.md); \}\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`processTextMessage`](VercelAi.md#processtextmessage)

***

### restart()

> **restart**(): `void`

Defined in: [packages/core/src/llm/vercelai-client.ts:131](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai-client.ts#L131)

Restarts the chat by clearing messages and resetting the LLM instance

#### Returns

`void`

#### Overrides

[`VercelAi`](VercelAi.md).[`restart`](VercelAi.md#restart)

***

### setAbortController()

> **setAbortController**(`abortController`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:217](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L217)

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

Defined in: [packages/core/src/llm/vercelai.ts:197](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L197)

#### Parameters

##### messages

`CoreMessage`[]

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`setMessages`](VercelAi.md#setmessages)

***

### stop()

> **stop**(): `void`

Defined in: [packages/core/src/llm/vercelai.ts:221](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L221)

Stop processing

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`stop`](VercelAi.md#stop)

***

### temporaryPrompt()

> **temporaryPrompt**(`__namedParameters`): `Promise`\<`string`\>

Defined in: [packages/core/src/llm/vercelai-client.ts:432](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai-client.ts#L432)

One time prompt without saving the conversation

#### Parameters

##### \_\_namedParameters

###### prompt

`string`

###### temperature?

`number`

#### Returns

`Promise`\<`string`\>

#### Overrides

[`VercelAi`](VercelAi.md).[`temporaryPrompt`](VercelAi.md#temporaryprompt)

***

### translateVoiceToText()

> **translateVoiceToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [packages/core/src/llm/assistant.ts:55](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/assistant.ts#L55)

Voice to text

#### Parameters

##### audioBlob

`Blob`

#### Returns

`Promise`\<`string`\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`translateVoiceToText`](VercelAi.md#translatevoicetotext)

***

### addToolResult()

> `static` **addToolResult**(`toolCallId`, `additionalData`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:181](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L181)

#### Parameters

##### toolCallId

`string`

##### additionalData

`unknown`

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`addToolResult`](VercelAi.md#addtoolresult)

***

### configure()

> `static` **configure**(`config`): `void`

Defined in: [packages/core/src/llm/vercelai-client.ts:114](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai-client.ts#L114)

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

Defined in: [packages/core/src/llm/vercelai-client.ts:76](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai-client.ts#L76)

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

Defined in: [packages/core/src/llm/vercelai.ts:146](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L146)

Get instance using singleton pattern

#### Returns

`Promise`\<[`VercelAi`](VercelAi.md)\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`getInstance`](VercelAi.md#getinstance)

***

### getToolResult()

> `static` **getToolResult**(`toolCallId`): `unknown`

Defined in: [packages/core/src/llm/vercelai.ts:185](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L185)

#### Parameters

##### toolCallId

`string`

#### Returns

`unknown`

#### Inherited from

[`VercelAi`](VercelAi.md).[`getToolResult`](VercelAi.md#gettoolresult)

***

### getToolResults()

> `static` **getToolResults**(): `void`

Defined in: [packages/core/src/llm/assistant.ts:99](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/assistant.ts#L99)

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`getToolResults`](VercelAi.md#gettoolresults)

***

### registerTool()

> `static` **registerTool**(`__namedParameters`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:172](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/vercelai.ts#L172)

#### Parameters

##### \_\_namedParameters

[`RegisterToolProps`](../type-aliases/RegisterToolProps.md)

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`registerTool`](VercelAi.md#registertool)

***

### testConnection()

> `static` **testConnection**(`apiKey`, `model`): `Promise`\<`boolean`\>

Defined in: [packages/core/src/llm/assistant.ts:82](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/llm/assistant.ts#L82)

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
