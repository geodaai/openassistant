# Class: WhisperVoiceHandler

Defined in: [lib/voice-handler.ts:9](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/lib/voice-handler.ts#L9)

Handles voice transcription requests using OpenAI Whisper

## Constructors

### new WhisperVoiceHandler()

> **new WhisperVoiceHandler**(`config`): [`WhisperVoiceHandler`](WhisperVoiceHandler.md)

Defined in: [lib/voice-handler.ts:16](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/lib/voice-handler.ts#L16)

#### Parameters

##### config

Configuration object

###### apiKey

`string`

OpenAI API key

#### Returns

[`WhisperVoiceHandler`](WhisperVoiceHandler.md)

## Methods

### processRequest()

> **processRequest**(`req`): `Promise`\<`Response`\>

Defined in: [lib/voice-handler.ts:25](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/lib/voice-handler.ts#L25)

Processes voice transcription requests

#### Parameters

##### req

`Request`

Incoming request object containing base64 audio data

#### Returns

`Promise`\<`Response`\>

Streaming response with transcription
