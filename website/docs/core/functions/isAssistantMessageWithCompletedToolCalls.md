# Function: isAssistantMessageWithCompletedToolCalls()

> **isAssistantMessageWithCompletedToolCalls**(`message`): `undefined` \| `boolean`

Defined in: [llm/vercelai.ts:36](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/llm/vercelai.ts#L36)

Check if the message is an assistant message with completed tool calls.
The message must have at least one tool invocation and all tool invocations
must have a result.

## Parameters

### message

`Message`

## Returns

`undefined` \| `boolean`
