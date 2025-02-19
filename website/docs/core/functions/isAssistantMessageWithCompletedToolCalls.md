# Function: isAssistantMessageWithCompletedToolCalls()

> **isAssistantMessageWithCompletedToolCalls**(`message`): `undefined` \| `boolean`

Defined in: [llm/vercelai.ts:26](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/llm/vercelai.ts#L26)

Check if the message is an assistant message with completed tool calls.
The message must have at least one tool invocation and all tool invocations
must have a result.

## Parameters

### message

`Message`

## Returns

`undefined` \| `boolean`
