# Type Alias: SendTextMessageProps

> **SendTextMessageProps**: `object`

Defined in: [hooks/use-assistant.ts:59](https://github.com/GeoDaCenter/openassistant/blob/a5eebdb32e6bf1b6b4eedf634485568edcefaa57/packages/core/src/hooks/use-assistant.ts#L59)

Type of SendTextMessageProps

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

The message to be sent.

## Param

The stream message callback to stream the message back to the UI. See [StreamMessageCallback](StreamMessageCallback.md) for more details.
