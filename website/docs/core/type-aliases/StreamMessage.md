# Type Alias: StreamMessage

> **StreamMessage**: `object`

Defined in: [packages/core/src/types.ts:126](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/core/src/types.ts#L126)

Type of StreamMessage. The structure of the stream message is:

## Type declaration

### parts?

> `optional` **parts**: [`StreamMessagePart`](StreamMessagePart.md)[]

The parts of the message. It is used for storing the returning result from LLM.

## Param

The parts of the message. This is the text that happens after the tool calls.
