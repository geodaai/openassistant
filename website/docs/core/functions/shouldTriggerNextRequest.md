# Function: shouldTriggerNextRequest()

> **shouldTriggerNextRequest**(`messages`, `messageCount`, `maxSteps`, `maxStep`): `boolean`

Defined in: [packages/core/src/llm/vercelai.ts:64](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/core/src/llm/vercelai.ts#L64)

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
