# Function: useAssistant()

> **useAssistant**(`props`): `object`

Defined in: [packages/core/src/hooks/use-assistant.ts:103](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/hooks/use-assistant.ts#L103)

A custom hook for managing an AI assistant.
This hook provides functionality to initialize, send messages to, and control an AI assistant.

## Parameters

### props

[`UseAssistantProps`](../type-aliases/UseAssistantProps.md)

## Returns

`object`

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

### getComponents()

> **getComponents**: () => `undefined` \| [`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

Returns the components for the assistant.

#### Returns

`undefined` \| [`ToolCallComponents`](../type-aliases/ToolCallComponents.md)

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

### temporaryPrompt()

> **temporaryPrompt**: (`params`) => `Promise`\<`undefined` \| `string`\>

Sends a one-time prompt to the assistant and returns the response. The prompt and response will not be saved.

Sends a one-time prompt to the assistant and returns the response. The prompt and response will not be saved.

#### Parameters

##### params

The text message to send to the assistant.

###### prompt

`string`

###### temperature?

`number`

#### Returns

`Promise`\<`undefined` \| `string`\>

The response from the assistant.

#### Param

The text message to send to the assistant.

#### Returns

The response from the assistant.
