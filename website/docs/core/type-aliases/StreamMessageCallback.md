# Type Alias: StreamMessageCallback()

> **StreamMessageCallback**: (`props`) => `void`

Defined in: [types.ts:261](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/core/src/types.ts#L261)

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
