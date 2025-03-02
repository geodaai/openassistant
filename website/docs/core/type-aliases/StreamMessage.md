# Type Alias: StreamMessage

> **StreamMessage**: `object`

Defined in: [types.ts:246](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L246)

Type of StreamMessage. The structure of the stream message is:

```
------------------
| reasoning      |
------------------
| toolCallMessage |
| toolCallMessage |
| toolCallMessage |
------------------
| text           |
------------------
```

## Type declaration

### reasoning?

> `optional` **reasoning**: `string`

### text?

> `optional` **text**: `string`

### toolCallMessages?

> `optional` **toolCallMessages**: [`ToolCallMessage`](ToolCallMessage.md)[]

## Param

The reasoning of the assistant

## Param

The tool call messages

## Param

The text of the message
