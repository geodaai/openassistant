# Type Alias: ExtendedTool\<PARAMETERS, RETURN_TYPE, ADDITIONAL_DATA, CONTEXT\>

> **ExtendedTool**\<`PARAMETERS`, `RETURN_TYPE`, `ADDITIONAL_DATA`, `CONTEXT`\>: `Tool`\<`PARAMETERS`\> & `object`

Defined in: [packages/core/src/utils/create-assistant.ts:84](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/core/src/utils/create-assistant.ts#L84)

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

> `optional` **context**: `CONTEXT`

The context that will be passed to the function

### execute

> **execute**: `ExecuteFunction`\<`PARAMETERS`, `RETURN_TYPE`, `ADDITIONAL_DATA`, `CONTEXT`\>

test

## Type Parameters

• **PARAMETERS** *extends* `Parameters` = `never`

• **RETURN_TYPE** = `never`

• **ADDITIONAL_DATA** = `never`

• **CONTEXT** = [`CustomFunctionContext`](CustomFunctionContext.md)\<`unknown`\> \| [`CustomFunctionContextCallback`](CustomFunctionContextCallback.md)\<`unknown`\>
