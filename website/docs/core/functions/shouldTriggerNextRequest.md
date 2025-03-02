# Function: shouldTriggerNextRequest()

> **shouldTriggerNextRequest**(`messages`, `messageCount`, `maxSteps`, `maxStep`): `boolean`

Defined in: [llm/vercelai.ts:62](https://github.com/GeoDaCenter/openassistant/blob/a5eebdb32e6bf1b6b4eedf634485568edcefaa57/packages/core/src/llm/vercelai.ts#L62)

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
