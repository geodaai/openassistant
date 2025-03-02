# Type Alias: SendTextMessageProps

> **SendTextMessageProps**: `object`

Defined in: [hooks/use-assistant.ts:59](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/hooks/use-assistant.ts#L59)

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
