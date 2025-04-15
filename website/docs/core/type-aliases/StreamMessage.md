# Type Alias: StreamMessage

> **StreamMessage**: `object`

Defined in: [packages/core/src/types.ts:325](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/core/src/types.ts#L325)

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

### ~~analysis?~~

> `optional` **analysis**: `string`

The analysis of the message

#### Deprecated

Use parts instead

### parts?

> `optional` **parts**: [`StreamMessagePart`](StreamMessagePart.md)[]

The parts of the message. It is used for storing the returning result from LLM.

### ~~reasoning?~~

> `optional` **reasoning**: `string`

The reasoning of the assistant

#### Deprecated

Use parts instead

### text?

> `optional` **text**: `string`

The text of the message. Normally, it is used for storing user's prompting text.

### ~~toolCallMessages?~~

> `optional` **toolCallMessages**: [`ToolCallMessage`](ToolCallMessage.md)[]

The tool call messages

#### Deprecated

Use parts instead

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
