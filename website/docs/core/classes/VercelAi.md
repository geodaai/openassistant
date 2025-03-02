# Class: VercelAi

Defined in: [llm/vercelai.ts:105](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L105)

Vercel AI Assistant for Server only.

## Extends

- `AbstractAssistant`

## Extended by

- [`VercelAiClient`](VercelAiClient.md)

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

#### Overrides

`AbstractAssistant.addAdditionalContext`

***

### audioToText()

> **audioToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [llm/vercelai.ts:403](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L403)

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

Defined in: [llm/assistant.ts:30](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/assistant.ts#L30)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractAssistant.close`

***

### getMessages()

> **getMessages**(): `Message`[]

Defined in: [llm/vercelai.ts:195](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L195)

#### Returns

`Message`[]

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

#### Overrides

`AbstractAssistant.processImageMessage`

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

#### Overrides

`AbstractAssistant.processTextMessage`

***

### restart()

> **restart**(): `void`

Defined in: [llm/vercelai.ts:218](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L218)

Restart the chat

#### Returns

`void`

#### Overrides

`AbstractAssistant.restart`

***

### setAbortController()

> **setAbortController**(`abortController`): `void`

Defined in: [llm/vercelai.ts:207](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L207)

#### Parameters

##### abortController

`AbortController`

#### Returns

`void`

***

### setMessages()

> **setMessages**(`messages`): `void`

Defined in: [llm/vercelai.ts:199](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L199)

#### Parameters

##### messages

`Message`[]

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [llm/vercelai.ts:211](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L211)

Stop processing

#### Returns

`void`

#### Overrides

`AbstractAssistant.stop`

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

`AbstractAssistant.translateVoiceToText`

***

### configure()

> `static` **configure**(`config`): `void`

Defined in: [llm/vercelai.ts:151](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L151)

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

Defined in: [llm/vercelai.ts:223](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L223)

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`VercelAi`](VercelAi.md)\>

Defined in: [llm/vercelai.ts:141](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/llm/vercelai.ts#L141)

Get instance using singleton pattern

#### Returns

`Promise`\<[`VercelAi`](VercelAi.md)\>

#### Overrides

`AbstractAssistant.getInstance`

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

#### Overrides

`AbstractAssistant.registerFunctionCalling`

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

`AbstractAssistant.testConnection`
