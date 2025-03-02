# Function: useAssistant()

> **useAssistant**(`props`): `object`

Defined in: [hooks/use-assistant.ts:90](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/hooks/use-assistant.ts#L90)

A custom hook for managing an AI assistant.
This hook provides functionality to initialize, send messages to, and control an AI assistant.

## Parameters

### props

[`UseAssistantProps`](../type-aliases/UseAssistantProps.md)

Configuration options for the assistant.

## Returns

`object`

An object containing methods to interact with the assistant and its current status.

### addAdditionalContext()

> **addAdditionalContext**: (`params`) => `Promise`\<`void`\>

Adds additional context to the ongoing conversation with the assistant.

Adds additional context to the assistant's conversation.

#### Parameters

##### params

The context and optional callback.

###### context

`string`

#### Returns

`Promise`\<`void`\>

#### Param

Object containing the context to add

#### Returns

### apiKeyStatus

> **apiKeyStatus**: `string`

Current status of the API key validation.
'failed' - The API key is invalid.
'success' - The API key is valid.

### audioToText()

> **audioToText**: (`audioBlob`) => `Promise`\<`undefined` \| `string`\>

Converts an audio blob to text using the assistant's speech-to-text capabilities.

Converts audio to text using the assistant's capabilities.

#### Parameters

##### audioBlob

`Blob`

The audio data to be converted.

#### Returns

`Promise`\<`undefined` \| `string`\>

The transcribed text.

#### Param

The audio data to transcribe

#### Returns

The transcribed text

### initializeAssistant()

> **initializeAssistant**: () => `Promise`\<`void`\>

Initializes the AI assistant with the configured settings.
Sets up the model, registers functions, and validates the API key.

Initializes the AI assistant with the provided configuration.

#### Returns

`Promise`\<`void`\>

#### Returns

### restartChat()

> **restartChat**: () => `Promise`\<`void`\>

Restarts the chat by stopping current processing and reinitializing the assistant.

Restarts the chat by stopping the current chat and reinitializing the assistant.

#### Returns

`Promise`\<`void`\>

#### Returns

### sendImageMessage()

> **sendImageMessage**: (`props`) => `Promise`\<`void`\>

Sends an image along with text to the AI assistant and streams the response.

Sends an image message to the assistant and processes the response.

#### Parameters

##### props

[`SendImageMessageProps`](../type-aliases/SendImageMessageProps.md)

The image data, message, and callback for streaming the response.

#### Returns

`Promise`\<`void`\>

#### Param

Object containing the image data, message, and stream callback

#### Returns

### sendTextMessage()

> **sendTextMessage**: (`props`) => `Promise`\<`void`\>

Sends a text message to the AI assistant and streams the response.

Sends a text message to the assistant and processes the response.

#### Parameters

##### props

[`SendTextMessageProps`](../type-aliases/SendTextMessageProps.md)

The message and callback for streaming the response.

#### Returns

`Promise`\<`void`\>

#### Param

Object containing the message and stream callback

#### Returns

### stopChat()

> **stopChat**: () => `void`

Immediately stops the current chat processing and response generation.

Stops the current chat processing.

#### Returns

`void`

#### Returns
