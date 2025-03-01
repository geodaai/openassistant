# Function: isAssistantMessageWithCompletedToolCalls()

> **isAssistantMessageWithCompletedToolCalls**(`message`): `undefined` \| `boolean`

Defined in: [llm/vercelai.ts:36](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/llm/vercelai.ts#L36)

Check if the message is an assistant message with completed tool calls.
The message must have at least one tool invocation and all tool invocations
must have a result.

## Parameters

### message

`Message`

## Returns

`undefined` \| `boolean`
