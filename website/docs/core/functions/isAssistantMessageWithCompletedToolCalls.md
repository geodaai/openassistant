# Function: isAssistantMessageWithCompletedToolCalls()

> **isAssistantMessageWithCompletedToolCalls**(`message`): `boolean`

Defined in: [packages/core/src/llm/vercelai.ts:44](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/core/src/llm/vercelai.ts#L44)

Check if the message is an assistant message with completed tool calls.
The message must have at least one tool invocation and all tool invocations
must have a result.

## Parameters

### message

`CoreMessage`

## Returns

`boolean`
