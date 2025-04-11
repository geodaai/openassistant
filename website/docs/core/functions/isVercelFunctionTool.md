# Function: isVercelFunctionTool()

> **isVercelFunctionTool**(`tool`): tool is ExtendedTool\<never, never, never, CustomFunctionContext\<unknown\> \| CustomFunctionContextCallback\<unknown\>\>

Defined in: [packages/core/src/utils/create-assistant.ts:171](https://github.com/GeoDaCenter/openassistant/blob/7dec66552ed2da789768e26aca21ecb2918b5d3b/packages/core/src/utils/create-assistant.ts#L171)

Type guard to check if a tool is a Vercel function tool

## Parameters

### tool

The tool to check

[`RegisterFunctionCallingProps`](../type-aliases/RegisterFunctionCallingProps.md) | [`ExtendedTool`](../type-aliases/ExtendedTool.md)\<`never`, `never`, `never`, [`CustomFunctionContext`](../type-aliases/CustomFunctionContext.md)\<`unknown`\> \| [`CustomFunctionContextCallback`](../type-aliases/CustomFunctionContextCallback.md)\<`unknown`\>\>

## Returns

tool is ExtendedTool\<never, never, never, CustomFunctionContext\<unknown\> \| CustomFunctionContextCallback\<unknown\>\>

True if the tool is a Vercel function tool
