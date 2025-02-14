# Class: `abstract` VercelAiClient

Defined in: [llm/vercelai-client.ts:44](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai-client.ts#L44)

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

Defined in: [llm/vercelai-client.ts:49](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai-client.ts#L49)

## Methods

### addAdditionalContext()

> **addAdditionalContext**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:162](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai.ts#L162)

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

Defined in: [llm/vercelai-client.ts:245](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai-client.ts#L245)

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

Defined in: [llm/assistant.ts:30](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/assistant.ts#L30)

Close the LLM instance

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`close`](VercelAi.md#close)

***

### processImageMessage()

> **processImageMessage**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:182](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai.ts#L182)

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

> **processTextMessage**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [llm/vercelai.ts:194](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai.ts#L194)

Process text message

#### Parameters

##### \_\_namedParameters

[`ProcessMessageProps`](../type-aliases/ProcessMessageProps.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`processTextMessage`](VercelAi.md#processtextmessage)

***

### restart()

> **restart**(): `void`

Defined in: [llm/vercelai-client.ts:83](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai-client.ts#L83)

Restart the chat

#### Returns

`void`

#### Overrides

[`VercelAi`](VercelAi.md).[`restart`](VercelAi.md#restart)

***

### stop()

> **stop**(): `void`

Defined in: [llm/vercelai.ts:166](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai.ts#L166)

Stop processing

#### Returns

`void`

#### Inherited from

[`VercelAi`](VercelAi.md).[`stop`](VercelAi.md#stop)

***

### translateVoiceToText()

> **translateVoiceToText**(`audioBlob`): `Promise`\<`string`\>

Defined in: [llm/assistant.ts:58](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/assistant.ts#L58)

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

Defined in: [llm/vercelai-client.ts:73](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai-client.ts#L73)

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

Defined in: [llm/vercelai-client.ts:53](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai-client.ts#L53)

#### Returns

`void`

#### Overrides

[`VercelAi`](VercelAi.md).[`getBaseURL`](VercelAi.md#getbaseurl)

***

### getInstance()

> `static` **getInstance**(): `Promise`\<[`VercelAi`](VercelAi.md)\>

Defined in: [llm/vercelai.ts:109](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai.ts#L109)

Get instance using singleton pattern

#### Returns

`Promise`\<[`VercelAi`](VercelAi.md)\>

#### Inherited from

[`VercelAi`](VercelAi.md).[`getInstance`](VercelAi.md#getinstance)

***

### registerFunctionCalling()

> `static` **registerFunctionCalling**(`__namedParameters`): `void`

Defined in: [llm/vercelai.ts:132](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/vercelai.ts#L132)

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

Defined in: [llm/assistant.ts:93](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/llm/assistant.ts#L93)

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
