# Function: isAssistantMessageWithCompletedToolCalls()

> **isAssistantMessageWithCompletedToolCalls**(`message`): `undefined` \| `boolean`

Defined in: [packages/core/src/llm/vercelai.ts:38](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/core/src/llm/vercelai.ts#L38)

Check if the message is an assistant message with completed tool calls.
The message must have at least one tool invocation and all tool invocations
must have a result.

## Parameters

### message

`Message`

## Returns

`undefined` \| `boolean`
