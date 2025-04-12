# Class: VercelAi

Defined in: [packages/core/src/llm/vercelai.ts:109](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L109)

Vercel AI Assistant for Server only.

## Extends

- `AbstractAssistant`

## Extended by

- [`VercelAiClient`](VercelAiClient.md)

## Methods

### addAdditionalContext()

> **addAdditionalContext**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/core/src/llm/vercelai.ts:251](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L251)

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

Defined in: [packages/core/src/llm/vercelai.ts:460](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L460)

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

Defined in: [packages/core/src/llm/assistant.ts:30](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/assistant.ts#L30)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

`AbstractAssistant.close`

***

### getComponents()

> **getComponents**(): [`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

Defined in: [packages/core/src/llm/vercelai.ts:230](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L230)

#### Returns

[`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

***

### getMessages()

> **getMessages**(): [`AIMessage`](../type-aliases/AIMessage.md)[]

Defined in: [packages/core/src/llm/vercelai.ts:222](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L222)

#### Returns

[`AIMessage`](../type-aliases/AIMessage.md)[]

***

### processImageMessage()

> **processImageMessage**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/core/src/llm/vercelai.ts:277](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L277)

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

> **processTextMessage**(`__namedParameters`): `Promise`\<\{ `messages`: [`AIMessage`](../type-aliases/AIMessage.md)[]; \}\>

Defined in: [packages/core/src/llm/vercelai.ts:299](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L299)

Process the text message by sending it to the LLM.

#### Parameters

##### \_\_namedParameters

[`ProcessMessageProps`](../type-aliases/ProcessMessageProps.md)

#### Returns

`Promise`\<\{ `messages`: [`AIMessage`](../type-aliases/AIMessage.md)[]; \}\>

Promise containing the newly added message

#### Overrides

`AbstractAssistant.processTextMessage`

***

### restart()

> **restart**(): `void`

Defined in: [packages/core/src/llm/vercelai.ts:266](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L266)

Restart the chat

#### Returns

`void`

#### Overrides

`AbstractAssistant.restart`

***

### setAbortController()

> **setAbortController**(`abortController`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:255](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L255)

#### Parameters

##### abortController

`AbortController`

#### Returns

`void`

***

### setMessages()

> **setMessages**(`messages`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:226](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L226)

#### Parameters

##### messages

`Message`[]

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [packages/core/src/llm/vercelai.ts:259](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L259)

Stop processing

#### Returns

`void`

#### Overrides

`AbstractAssistant.stop`

***

### translateVoiceToText()

> **translateVoiceToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [packages/core/src/llm/assistant.ts:58](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/assistant.ts#L58)

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

Defined in: [packages/core/src/llm/vercelai.ts:174](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L174)

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

Defined in: [packages/core/src/llm/vercelai.ts:271](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L271)

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`VercelAi`](VercelAi.md)\>

Defined in: [packages/core/src/llm/vercelai.ts:164](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L164)

Get instance using singleton pattern

#### Returns

`Promise`\<[`VercelAi`](VercelAi.md)\>

#### Overrides

`AbstractAssistant.getInstance`

***

### registerFunctionCalling()

> `static` **registerFunctionCalling**(`__namedParameters`): `void`

Defined in: [packages/core/src/llm/vercelai.ts:190](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/vercelai.ts#L190)

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

Defined in: [packages/core/src/llm/assistant.ts:93](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/llm/assistant.ts#L93)

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
