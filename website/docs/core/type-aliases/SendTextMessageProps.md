# Type Alias: SendTextMessageProps

> **SendTextMessageProps**: `object`

Defined in: [packages/core/src/hooks/use-assistant.ts:64](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/core/src/hooks/use-assistant.ts#L64)

Parameters for sending a text message to the assistant.

## Type declaration

### message

> **message**: `string`

### onStepFinish()?

> `optional` **onStepFinish**: (`event`, `toolCallMessages`) => `Promise`\<`void`\> \| `void`

#### Parameters

##### event

`StepResult`\<`ToolSet`\>

##### toolCallMessages

[`ToolCallMessage`](ToolCallMessage.md)[]

#### Returns

`Promise`\<`void`\> \| `void`

### streamMessageCallback

> **streamMessageCallback**: [`StreamMessageCallback`](StreamMessageCallback.md)

## Param

The text message to send to the assistant.

## Param

Callback function to handle streaming response chunks.

## Param

Optional callback triggered when a conversation step completes.
