# Type Alias: ExtendedTool\<PARAMETERS\>

> **ExtendedTool**\<`PARAMETERS`\>: `Tool`\<`PARAMETERS`\> & `object`

Defined in: [utils/create-assistant.ts:79](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/utils/create-assistant.ts#L79)

A tool contains the description and the schema of the input that the tool expects.
This enables the language model to generate the input.
ExtendedTool extends the Tool type from Vercel AI SDK: https://sdk.vercel.ai/docs/reference/ai-sdk-core/tool#tool.tool

The tool can also contain:
- an optional execute function for the actual execution function of the tool.
- an optional context for providing additional data for the tool execution.
- an optional component for rendering additional information (e.g. chart or map) of LLM response.

## Type declaration

### component?

> `optional` **component**: `React.ElementType`

The component that will be rendered when the tool is executed

### context?

> `optional` **context**: [`CustomFunctionContext`](CustomFunctionContext.md)\<`unknown`\> \| [`CustomFunctionContextCallback`](CustomFunctionContextCallback.md)\<`unknown`\>

The context that will be passed to the function

### execute

> **execute**: `ExecuteFunction`\<`PARAMETERS`\>

test

## Type Parameters

• **PARAMETERS** *extends* `Parameters` = `never`
