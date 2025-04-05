# Type Alias: StreamMessage

> **StreamMessage**: `object`

Defined in: [packages/core/src/types.ts:312](https://github.com/GeoDaCenter/openassistant/blob/a1bcfdf89aac2d64b3bda9cf92b96ead076def28/packages/core/src/types.ts#L312)

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

### analysis?

> `optional` **analysis**: `string`

### parts?

> `optional` **parts**: [`StreamMessagePart`](StreamMessagePart.md)[]

### reasoning?

> `optional` **reasoning**: `string`

### text?

> `optional` **text**: `string`

### toolCallMessages?

> `optional` **toolCallMessages**: [`ToolCallMessage`](ToolCallMessage.md)[]

## Param

(deprecated. use parts instead) The reasoning of the assistant

## Param

(deprecated. use parts instead) The array of tool call messages. See [ToolCallMessage](ToolCallMessage.md) for more details.

## Param

(deprecated. use parts instead) The analysis of the message. This is the text that happens before the tool calls.

## Param

(deprecated. use parts instead) The text of the message. This is the text that happens after the tool calls.

## Param

The parts of the message. This is the text that happens after the tool calls.
