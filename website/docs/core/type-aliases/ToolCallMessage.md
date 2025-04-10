# Type Alias: ToolCallMessage

> **ToolCallMessage**: `object`

Defined in: [packages/core/src/types.ts:62](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/core/src/types.ts#L62)

Type of ToolCallMessage

The tool call message is used to store the tool call information.

## Type declaration

### additionalData?

> `optional` **additionalData**: `unknown`

### args

> **args**: `Record`\<`string`, `unknown`\>

### isCompleted

> **isCompleted**: `boolean`

### llmResult?

> `optional` **llmResult**: `unknown`

### text?

> `optional` **text**: `string`

### toolCallId

> **toolCallId**: `string`

### toolName

> **toolName**: `string`

## Param

The id of the tool call

## Param

The name of the tool

## Param

The arguments of the tool

## Param

The result from the execution of the tool, which will be sent back to the LLM as response.

## Param

The additional data of the tool, which can be used to pass the output of the tool to next tool call or the component for rendering.

## Param

The streaming text of the tool

## Param

The flag indicating if the tool call is completed. Note: there are three stages of the tool call:
1. The tool call is requested by the LLM with the tool name and arguments.
2. The tool call is executing and `{llmResult, additionalData}` will be updated.
3. The tool call is completed and `{llmResult}` will be sent back to the LLM as response.
