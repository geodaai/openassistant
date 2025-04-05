# Type Alias: MessageModel

> **MessageModel**: `object`

Defined in: [packages/core/src/types.ts:122](https://github.com/GeoDaCenter/openassistant/blob/a1bcfdf89aac2d64b3bda9cf92b96ead076def28/packages/core/src/types.ts#L122)

Type of Message model

## Type declaration

### direction

> **direction**: [`MessageDirection`](MessageDirection.md)

### ~~message?~~

> `optional` **message**: `string`

The message to be sent and received from the assistant.

#### Deprecated

Use messageContent.text instead

### messageContent?

> `optional` **messageContent**: [`StreamMessage`](StreamMessage.md)

### payload?

> `optional` **payload**: [`MessagePayload`](MessagePayload.md)

### position

> **position**: `"single"` \| `"first"` \| `"normal"` \| `"last"` \| `0` \| `1` \| `2` \| `3`

### sender?

> `optional` **sender**: `string`

### sentTime?

> `optional` **sentTime**: `string`

### type?

> `optional` **type**: [`MessageType`](MessageType.md)

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
