# Type Alias: ProcessMessageProps

> **ProcessMessageProps**: `object`

Defined in: [types.ts:237](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L237)

Type of ProcessMessageProps

## Type declaration

### imageMessage?

> `optional` **imageMessage**: `string`

### message?

> `optional` **message**: `string`

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

### textMessage?

> `optional` **textMessage**: `string`

### userActions?

> `optional` **userActions**: [`UserActionProps`](UserActionProps.md)[]

### useTool?

> `optional` **useTool**: `boolean`

## Param

The text message to be processed.

## Param

The image message to be processed.

## Param

The user actions to be processed.

## Param

The stream message callback to stream the message back to the UI.

## Param

The flag to indicate if the tool is used.

## Param

The message to be processed.
