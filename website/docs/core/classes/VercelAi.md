# Class: VercelAi

Defined in: [packages/core/src/llm/vercelai.ts:105](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L105)

Vercel AI Assistant for Server only.

## Extends

- `AbstractAssistant`

## Extended by

- [`VercelAiClient`](VercelAiClient.md)

## Methods

### addMessage()

> **addMessage**(`message`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:195](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L195)

#### Parameters

##### message

`CoreMessage`

#### Returns

`void`

***

### audioToText()

> **audioToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [packages/core/src/llm/vercelai.ts:408](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L408)

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

Defined in: [packages/core/src/llm/assistant.ts:27](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/assistant.ts#L27)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractAssistant.close`

***

### getComponents()

> **getComponents**(): [`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

Defined in: [packages/core/src/llm/vercelai.ts:203](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L203)

#### Returns

[`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

***

### getMessages()

> **getMessages**(): `CoreMessage`[]

Defined in: [packages/core/src/llm/vercelai.ts:191](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L191)

#### Returns

`CoreMessage`[]

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

#### Overrides

`AbstractAssistant.processImageMessage`

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

#### Overrides

`AbstractAssistant.processTextMessage`

***

### restart()

> **restart**(): `void`

Defined in: [packages/core/src/llm/vercelai.ts:230](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L230)

Restart the chat

#### Returns

`void`

#### Overrides

`AbstractAssistant.restart`

***

### setAbortController()

> **setAbortController**(`abortController`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:219](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L219)

#### Parameters

##### abortController

`AbortController`

#### Returns

`void`

***

### setMessages()

> **setMessages**(`messages`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:199](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L199)

#### Parameters

##### messages

`CoreMessage`[]

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [packages/core/src/llm/vercelai.ts:223](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L223)

Stop processing

#### Returns

`void`

#### Overrides

`AbstractAssistant.stop`

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

`AbstractAssistant.translateVoiceToText`

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

***

### configure()

> `static` **configure**(`config`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:158](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L158)

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

Defined in: [packages/core/src/llm/vercelai.ts:235](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L235)

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`VercelAi`](VercelAi.md)\>

Defined in: [packages/core/src/llm/vercelai.ts:148](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L148)

Get instance using singleton pattern

#### Returns

`Promise`\<[`VercelAi`](VercelAi.md)\>

#### Overrides

`AbstractAssistant.getInstance`

***

### getToolResult()

> `static` **getToolResult**(`toolCallId`): `unknown`

Defined in: [packages/core/src/llm/vercelai.ts:187](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L187)

#### Parameters

##### toolCallId

`string`

#### Returns

`unknown`

***

### registerTool()

> `static` **registerTool**(`__namedParameters`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:174](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L174)

#### Parameters

##### \_\_namedParameters

[`RegisterToolProps`](../type-aliases/RegisterToolProps.md)

#### Returns

`void`

#### Overrides

`AbstractAssistant.registerTool`

***

### testConnection()

> `static` **testConnection**(`apiKey`, `model`): `Promise`\<`boolean`\>

Defined in: [packages/core/src/llm/assistant.ts:82](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/assistant.ts#L82)

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
