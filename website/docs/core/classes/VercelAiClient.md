# Class: `abstract` VercelAiClient

Defined in: [llm/vercelai-client.ts:57](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai-client.ts#L57)

Abstract Vercel AI Client for Client only. This class is extended from VercelAi class.
However, it overrides the triggerRequest method to call LLM using Vercel AI SDK
directly from local e.g. browser instead of POST request to API endpoint.

It has a protected property llm: LanguageModel | null = null, which is initialized in the constructor.
It also has a protected static properties which are for client-side support:
- apiKey: string = '';
- model: string = '';
- baseURL: string = '';

These properties are initialized in the configure method.

The constructor is protected, so it cannot be instantiated directly.

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

Defined in: [llm/vercelai-client.ts:62](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai-client.ts#L62)

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

[`VercelAi`](VercelAi.md).[`addAdditionalContext`](VercelAi.md#addadditionalcontext)

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

#### Overrides

[`VercelAi`](VercelAi.md).[`audioToText`](VercelAi.md#audiototext)

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [llm/assistant.ts:30](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/assistant.ts#L30)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`close`](VercelAi.md#close)

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

[`VercelAi`](VercelAi.md).[`processImageMessage`](VercelAi.md#processimagemessage)

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

[`VercelAi`](VercelAi.md).[`processTextMessage`](VercelAi.md#processtextmessage)

***

### restart()

> **restart**(): `void`

Defined in: [llm/vercelai-client.ts:98](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai-client.ts#L98)

Restart the chat

#### Returns

`void`

#### Overrides

[`VercelAi`](VercelAi.md).[`restart`](VercelAi.md#restart)

***

### stop()

> **stop**(): `void`

Defined in: [llm/vercelai.ts:178](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L178)

Stop processing

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`stop`](VercelAi.md#stop)

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

[`VercelAi`](VercelAi.md).[`translateVoiceToText`](VercelAi.md#translatevoicetotext)

***

### configure()

> `static` **configure**(`config`): `void`

Defined in: [llm/vercelai-client.ts:86](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai-client.ts#L86)

Configure the LLM instance

#### Parameters

##### config

[`VercelAiClientConfigureProps`](../type-aliases/VercelAiClientConfigureProps.md)

#### Returns

`void`

#### Overrides

[`VercelAi`](VercelAi.md).[`configure`](VercelAi.md#configure)

***

### getBaseURL()

> `static` **getBaseURL**(): `void`

Defined in: [llm/vercelai-client.ts:66](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai-client.ts#L66)

#### Returns

`void`

#### Overrides

[`VercelAi`](VercelAi.md).[`getBaseURL`](VercelAi.md#getbaseurl)

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`VercelAi`](VercelAi.md)\>

Defined in: [llm/vercelai.ts:120](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L120)

Get instance using singleton pattern

#### Returns

`Promise`\<[`VercelAi`](VercelAi.md)\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`getInstance`](VercelAi.md#getinstance)

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

[`VercelAi`](VercelAi.md).[`registerFunctionCalling`](VercelAi.md#registerfunctioncalling)

***

### testConnection()

> `static` **testConnection**(`apiKey`, `model`): `Promise`\<`boolean`\>

Defined in: [llm/assistant.ts:93](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/assistant.ts#L93)

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
