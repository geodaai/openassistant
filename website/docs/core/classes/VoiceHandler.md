# Class: VoiceHandler

Defined in: [packages/core/src/lib/voice-handler.ts:62](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/lib/voice-handler.ts#L62)

Handles voice transcription requests using Google Gemini

## Constructors

### new VoiceHandler()

> **new VoiceHandler**(`__namedParameters`): [`VoiceHandler`](VoiceHandler.md)

Defined in: [packages/core/src/lib/voice-handler.ts:65](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/lib/voice-handler.ts#L65)

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

Defined in: [packages/core/src/lib/voice-handler.ts:93](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/lib/voice-handler.ts#L93)

#### Parameters

##### req

`Request`

#### Returns

`Promise`\<`Response`\>
