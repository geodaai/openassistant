# Type Alias: MessageModel

> **MessageModel**: `object`

Defined in: [packages/core/src/types.ts:114](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/core/src/types.ts#L114)

Type of Message model used in the chat component

## Type declaration

### direction

> **direction**: [`MessageDirection`](MessageDirection.md)

The direction of the message

### ~~message?~~

> `optional` **message**: `string`

The message to be sent and received from the assistant.

#### Deprecated

Use messageContent.text instead

### messageContent?

> `optional` **messageContent**: [`StreamMessage`](StreamMessage.md)

The content of the message

### payload?

> `optional` **payload**: [`MessagePayload`](MessagePayload.md)

The payload of the message

### position

> **position**: `"single"` \| `"first"` \| `"normal"` \| `"last"` \| `0` \| `1` \| `2` \| `3`

The position of the message

### sender?

> `optional` **sender**: `"user"` \| `"assistant"` \| `"error"`

The sender of the message

### sentTime?

> `optional` **sentTime**: `string`

The time the message was sent

### type?

> `optional` **type**: [`MessageType`](MessageType.md)

The type of the message
