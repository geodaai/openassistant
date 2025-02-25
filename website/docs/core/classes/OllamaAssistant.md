# Class: OllamaAssistant

Defined in: [llm/ollama.ts:14](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/ollama.ts#L14)

Ollama Assistant LLM for Client only

## Extends

- [`VercelAiClient`](VercelAiClient.md)

## Properties

### llm

> **llm**: `null` \| `LanguageModelV1` = `null`

Defined in: [llm/vercelai-client.ts:62](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai-client.ts#L62)

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`llm`](VercelAiClient.md#llm)

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

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`addAdditionalContext`](VercelAiClient.md#addadditionalcontext)

***

### audioToText()

> **audioToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [llm/vercelai-client.ts:324](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai-client.ts#L324)

audioToText method to use API endpoint for audio transcription

#### Parameters

##### audioBlob

[`AudioToTextProps`](../type-aliases/AudioToTextProps.md)

The audio blob to transcribe

#### Returns

`Promise`\<`string`\>

The transcribed text

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`audioToText`](VercelAiClient.md#audiototext)

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [llm/assistant.ts:30](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/assistant.ts#L30)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`close`](VercelAiClient.md#close)

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

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`processImageMessage`](VercelAiClient.md#processimagemessage)

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

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`processTextMessage`](VercelAiClient.md#processtextmessage)

***

### restart()

> **restart**(): `void`

Defined in: [llm/ollama.ts:74](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/ollama.ts#L74)

Restart the chat

#### Returns

`void`

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`restart`](VercelAiClient.md#restart)

***

### stop()

> **stop**(): `void`

Defined in: [llm/vercelai.ts:178](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L178)

Stop processing

#### Returns

`void`

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`stop`](VercelAiClient.md#stop)

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

[`VercelAiClient`](VercelAiClient.md).[`translateVoiceToText`](VercelAiClient.md#translatevoicetotext)

***

### configure()

> `static` **configure**(`config`): `void`

Defined in: [llm/ollama.ts:41](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/ollama.ts#L41)

Configure the LLM instance

#### Parameters

##### config

`ConfigureProps`

#### Returns

`void`

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`configure`](VercelAiClient.md#configure)

***

### getBaseURL()

> `static` **getBaseURL**(): `string`

Defined in: [llm/ollama.ts:27](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/ollama.ts#L27)

#### Returns

`string`

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`getBaseURL`](VercelAiClient.md#getbaseurl)

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`OllamaAssistant`](OllamaAssistant.md)\>

Defined in: [llm/ollama.ts:67](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/ollama.ts#L67)

Get instance using singleton pattern

#### Returns

`Promise`\<[`OllamaAssistant`](OllamaAssistant.md)\>

#### Overrides

[`VercelAiClient`](VercelAiClient.md).[`getInstance`](VercelAiClient.md#getinstance)

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

#### Inherited from

[`VercelAiClient`](VercelAiClient.md).[`registerFunctionCalling`](VercelAiClient.md#registerfunctioncalling)

***

### testConnection()

> `static` **testConnection**(`apiKey`, `model`): `Promise`\<`boolean`\>

Defined in: [llm/ollama.ts:31](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/ollama.ts#L31)

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
