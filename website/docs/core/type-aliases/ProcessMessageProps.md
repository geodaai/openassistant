# Type Alias: ProcessMessageProps

> **ProcessMessageProps**: `object`

Defined in: [types.ts:219](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/types.ts#L219)

Type of ProcessMessageProps

## Type declaration

### imageMessage?

> `optional` **imageMessage**: `string`

### message?

> `optional` **message**: `string`

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
