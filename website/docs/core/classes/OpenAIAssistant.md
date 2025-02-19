# Class: OpenAIAssistant

Defined in: [llm/openai.ts:19](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/openai.ts#L19)

OpenAI Assistant LLM for Client only

## Extends

- [`VercelAiClient`](VercelAiClient.md)

## Properties

### llm

> **llm**: `null` \| `LanguageModelV1` = `null`

Defined in: [llm/vercelai-client.ts:53](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/vercelai-client.ts#L53)

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`llm`](VercelAiClient.md#llm)

## Methods

### addAdditionalContext()

> **addAdditionalContext**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:162](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/vercelai.ts#L162)

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

> **audioToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [llm/openai.ts:98](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/openai.ts#L98)

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

Defined in: [llm/assistant.ts:30](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/assistant.ts#L30)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`close`](VercelAiClient.md#close)

***

### processImageMessage()

> **processImageMessage**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:182](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/vercelai.ts#L182)

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

> **processTextMessage**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:194](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/vercelai.ts#L194)

Process text message

#### Parameters

##### \_\_namedParameters

[`ProcessMessageProps`](../type-aliases/ProcessMessageProps.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`processTextMessage`](VercelAiClient.md#processtextmessage)

***

### restart()

> **restart**(): `void`

Defined in: [llm/openai.ts:85](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/openai.ts#L85)

Restart the chat

#### Returns

`void`

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`restart`](VercelAiClient.md#restart)

***

### stop()

> **stop**(): `void`

Defined in: [llm/vercelai.ts:166](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/vercelai.ts#L166)

Stop processing

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`stop`](VercelAiClient.md#stop)

***

### translateVoiceToText()

> **translateVoiceToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [llm/assistant.ts:58](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/assistant.ts#L58)

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

Defined in: [llm/openai.ts:32](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/openai.ts#L32)

Configure the LLM instance

#### Parameters

##### config

[`VercelAiClientConfigureProps`](../type-aliases/VercelAiClientConfigureProps.md)

#### Returns

`void`

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`configure`](VercelAiClient.md#configure)

***

### getBaseURL()

> `static` **getBaseURL**(): `string`

Defined in: [llm/openai.ts:28](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/openai.ts#L28)

#### Returns

`string`

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`getBaseURL`](VercelAiClient.md#getbaseurl)

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`OpenAIAssistant`](OpenAIAssistant.md)\>

Defined in: [llm/openai.ts:78](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/openai.ts#L78)

Get instance using singleton pattern

#### Returns

`Promise`\<[`OpenAIAssistant`](OpenAIAssistant.md)\>

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`getInstance`](VercelAiClient.md#getinstance)

***

### registerFunctionCalling()

> `static` **registerFunctionCalling**(`__namedParameters`): `void`

Defined in: [llm/vercelai.ts:132](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/vercelai.ts#L132)

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

Defined in: [llm/openai.ts:37](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/openai.ts#L37)

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
