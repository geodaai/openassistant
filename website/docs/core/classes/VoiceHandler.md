# Class: VoiceHandler

Defined in: [lib/voice-handler.ts:62](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/lib/voice-handler.ts#L62)

Handles voice transcription requests using Google Gemini

## Constructors

### new VoiceHandler()

> **new VoiceHandler**(`__namedParameters`): [`VoiceHandler`](VoiceHandler.md)

Defined in: [lib/voice-handler.ts:65](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/lib/voice-handler.ts#L65)

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

Defined in: [lib/voice-handler.ts:93](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/core/src/lib/voice-handler.ts#L93)

#### Parameters

##### req

`Request`

#### Returns

`Promise`\<`Response`\>
