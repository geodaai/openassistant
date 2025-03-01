# Class: VoiceHandler

Defined in: [lib/voice-handler.ts:62](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/lib/voice-handler.ts#L62)

Handles voice transcription requests using Google Gemini

## Constructors

### new VoiceHandler()

> **new VoiceHandler**(`__namedParameters`): [`VoiceHandler`](VoiceHandler.md)

Defined in: [lib/voice-handler.ts:65](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/lib/voice-handler.ts#L65)

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

Defined in: [lib/voice-handler.ts:93](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/lib/voice-handler.ts#L93)

#### Parameters

##### req

`Request`

#### Returns

`Promise`\<`Response`\>
