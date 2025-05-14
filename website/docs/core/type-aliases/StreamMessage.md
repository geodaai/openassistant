# Type Alias: StreamMessage

> **StreamMessage**: `object`

Defined in: [packages/core/src/types.ts:127](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/types.ts#L127)

Type of StreamMessage. The structure of the stream message is:

## Type declaration

### parts?

> `optional` **parts**: [`StreamMessagePart`](StreamMessagePart.md)[]

The parts of the message. It is used for storing the returning result from LLM.

## Param

The parts of the message. This is the text that happens after the tool calls.
