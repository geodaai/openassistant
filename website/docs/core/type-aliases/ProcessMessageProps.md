# Type Alias: ProcessMessageProps

> **ProcessMessageProps**: `object`

Defined in: [packages/core/src/types.ts:416](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/core/src/types.ts#L416)

Type of ProcessMessageProps

## Type declaration

### imageMessage?

> `optional` **imageMessage**: `string`

### message?

> `optional` **message**: `string`

### onStepFinish()?

> `optional` **onStepFinish**: (`event`, `toolCallMessages`) => `Promise`\<`void`\> \| `void`

The callback function to handle the step finish.

#### Parameters

##### event

`StepResult`\<`ToolSet`\>

The step result returned from Vercel AI SDK

##### toolCallMessages

[`ToolCallMessage`](ToolCallMessage.md)[]

The tool call messages, that can be used to update the UI, see [ToolCallMessage](ToolCallMessage.md)

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

The callback function to handle the step finish.

## Param

The flag to indicate if the tool is used.

## Param

The message to be processed.
