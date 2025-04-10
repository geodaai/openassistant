# Class: VoiceHandler

Defined in: [packages/core/src/lib/voice-handler.ts:62](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/core/src/lib/voice-handler.ts#L62)

Handles voice transcription requests using Google Gemini

## Constructors

### new VoiceHandler()

> **new VoiceHandler**(`__namedParameters`): [`VoiceHandler`](VoiceHandler.md)

Defined in: [packages/core/src/lib/voice-handler.ts:65](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/core/src/lib/voice-handler.ts#L65)

#### Parameters

##### \_\_namedParameters

###### apiKey

`string`

###### model

`string`

###### provider

`string`

#### Returns

[`VoiceHandler`](VoiceHandler.md)

## Methods

### processRequest()

> **processRequest**(`req`): `Promise`\<`Response`\>

Defined in: [packages/core/src/lib/voice-handler.ts:93](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/core/src/lib/voice-handler.ts#L93)

#### Parameters

##### req

`Request`

#### Returns

`Promise`\<`Response`\>
