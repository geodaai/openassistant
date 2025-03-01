# Interface: MessageModel

Defined in: [types.ts:47](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L47)

Type of Message model

## Param

The message to be sent

## Param

The time the message was sent

## Param

The sender of the message

## Param

The direction of the message

## Param

The position of the message

## Param

The type of the message

## Param

The payload of the message, can be string, object, image or custom

## Properties

### direction

> **direction**: [`MessageDirection`](../type-aliases/MessageDirection.md)

Defined in: [types.ts:55](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L55)

***

### ~~message?~~

> `optional` **message**: `string`

Defined in: [types.ts:52](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L52)

The message to be sent and received from the assistant.

#### Deprecated

Use messageContent.text instead

***

### messageContent?

> `optional` **messageContent**: [`StreamMessage`](../type-aliases/StreamMessage.md)

Defined in: [types.ts:60](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L60)

***

### payload?

> `optional` **payload**: [`MessagePayload`](../type-aliases/MessagePayload.md)

Defined in: [types.ts:58](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L58)

***

### position

> **position**: `0` \| `1` \| `"single"` \| `"first"` \| `"normal"` \| `"last"` \| `2` \| `3`

Defined in: [types.ts:56](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L56)

***

### sender?

> `optional` **sender**: `string`

Defined in: [types.ts:54](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L54)

***

### sentTime?

> `optional` **sentTime**: `string`

Defined in: [types.ts:53](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L53)

***

### toolCallMessages?

> `optional` **toolCallMessages**: [`ToolCallMessage`](../type-aliases/ToolCallMessage.md)[]

Defined in: [types.ts:59](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L59)

***

### type?

> `optional` **type**: [`MessageType`](../type-aliases/MessageType.md)

Defined in: [types.ts:57](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L57)
