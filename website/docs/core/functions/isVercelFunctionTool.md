# Function: isVercelFunctionTool()

> **isVercelFunctionTool**(`tool`): tool is ExtendedTool\<never, never, never, CustomFunctionContext\<unknown\> \| CustomFunctionContextCallback\<unknown\>\>

Defined in: [packages/core/src/utils/create-assistant.ts:182](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/core/src/utils/create-assistant.ts#L182)

Type guard to check if a tool is a Vercel function tool

## Parameters

### tool

The tool to check

[`RegisterFunctionCallingProps`](../type-aliases/RegisterFunctionCallingProps.md) | [`ExtendedTool`](../type-aliases/ExtendedTool.md)\<`never`, `never`, `never`, [`CustomFunctionContext`](../type-aliases/CustomFunctionContext.md)\<`unknown`\> \| [`CustomFunctionContextCallback`](../type-aliases/CustomFunctionContextCallback.md)\<`unknown`\>\>

## Returns

tool is ExtendedTool\<never, never, never, CustomFunctionContext\<unknown\> \| CustomFunctionContextCallback\<unknown\>\>

True if the tool is a Vercel function tool
