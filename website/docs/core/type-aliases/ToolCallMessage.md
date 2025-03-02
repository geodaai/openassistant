# Type Alias: ToolCallMessage

> **ToolCallMessage**: `object`

Defined in: [types.ts:27](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L27)

Type of ToolCallMessage

The tool call message is used to store the tool call information for UI display, see [StreamMessage](StreamMessage.md).
Note: the ToolCallMessage is not used in the tool call execution.

## Type declaration

### element?

> `optional` **element**: `ReactNode`

### reason?

> `optional` **reason**: `string`

### text?

> `optional` **text**: `string`

### toolCallId

> **toolCallId**: `string`

## Param

The id of the tool call

## Param

The element of the tool call

## Param

The text of the tool call

## Param

The reason of the tool call
