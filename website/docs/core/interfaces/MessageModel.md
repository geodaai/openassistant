# Interface: MessageModel

Defined in: [types.ts:46](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L46)

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

Defined in: [types.ts:54](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L54)

***

### ~~message?~~

> `optional` **message**: `string`

Defined in: [types.ts:51](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L51)

The message to be sent and received from the assistant.

#### Deprecated

Use messageContent.text instead

***

### messageContent?

> `optional` **messageContent**: [`StreamMessage`](../type-aliases/StreamMessage.md)

Defined in: [types.ts:59](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L59)

***

### payload?

> `optional` **payload**: [`MessagePayload`](../type-aliases/MessagePayload.md)

Defined in: [types.ts:57](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L57)

***

### position

> **position**: `0` \| `1` \| `"single"` \| `"first"` \| `"normal"` \| `"last"` \| `2` \| `3`

Defined in: [types.ts:55](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L55)

***

### sender?

> `optional` **sender**: `string`

Defined in: [types.ts:53](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L53)

***

### sentTime?

> `optional` **sentTime**: `string`

Defined in: [types.ts:52](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L52)

***

### toolCallMessages?

> `optional` **toolCallMessages**: [`ToolCallMessage`](../type-aliases/ToolCallMessage.md)[]

Defined in: [types.ts:58](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L58)

***

### type?

> `optional` **type**: [`MessageType`](../type-aliases/MessageType.md)

Defined in: [types.ts:56](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L56)
