# Interface: MessageModel

Defined in: [types.ts:74](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L74)

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

Defined in: [types.ts:82](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L82)

***

### ~~message?~~

> `optional` **message**: `string`

Defined in: [types.ts:79](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L79)

The message to be sent and received from the assistant.

#### Deprecated

Use messageContent.text instead

***

### messageContent?

> `optional` **messageContent**: [`StreamMessage`](../type-aliases/StreamMessage.md)

Defined in: [types.ts:86](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L86)

***

### payload?

> `optional` **payload**: [`MessagePayload`](../type-aliases/MessagePayload.md)

Defined in: [types.ts:85](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L85)

***

### position

> **position**: `0` \| `1` \| `"single"` \| `"first"` \| `"normal"` \| `"last"` \| `2` \| `3`

Defined in: [types.ts:83](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L83)

***

### sender?

> `optional` **sender**: `string`

Defined in: [types.ts:81](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L81)

***

### sentTime?

> `optional` **sentTime**: `string`

Defined in: [types.ts:80](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L80)

***

### type?

> `optional` **type**: [`MessageType`](../type-aliases/MessageType.md)

Defined in: [types.ts:84](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L84)
