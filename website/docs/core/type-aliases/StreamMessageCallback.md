# Type Alias: StreamMessageCallback()

> **StreamMessageCallback**: (`props`) => `void`

Defined in: [types.ts:215](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/types.ts#L215)

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
