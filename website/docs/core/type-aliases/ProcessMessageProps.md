# Type Alias: ProcessMessageProps

> **ProcessMessageProps**: `object`

Defined in: [types.ts:243](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L243)

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
