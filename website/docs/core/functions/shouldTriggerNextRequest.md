# Function: shouldTriggerNextRequest()

> **shouldTriggerNextRequest**(`messages`, `messageCount`, `maxSteps`, `maxStep`): `boolean`

Defined in: [llm/vercelai.ts:45](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/llm/vercelai.ts#L45)

Checks if another request should be triggered based on the current message state

## Parameters

### messages

`Message`[]

Current message array

### messageCount

`number`

Previous message count before last request

### maxSteps

`number`

Maximum number of allowed steps

### maxStep

Current maximum tool invocation step

`undefined` | `number`

## Returns

`boolean`

boolean indicating if another request should be triggered
