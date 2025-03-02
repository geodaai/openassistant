# Type Alias: StreamMessageCallback()

> **StreamMessageCallback**: (`props`) => `void`

Defined in: [types.ts:215](https://github.com/GeoDaCenter/openassistant/blob/aa41155e698e0b65b1716140c0c14440cdd9d76a/packages/core/src/types.ts#L215)

Type of StreamMessageCallback

## Parameters

### props

The callback properties

#### customMessage?

[`MessagePayload`](MessagePayload.md)

Optional custom message payload

#### deltaMessage

`string`

The incremental message update from the assistant

#### isCompleted?

`boolean`

Optional flag indicating if the message stream is complete

#### message?

[`StreamMessage`](StreamMessage.md)

Optional full stream message object

## Returns

`void`
