# Function: isVercelFunctionTool()

> **isVercelFunctionTool**(`tool`): tool is ExtendedTool\<never, never, never, CustomFunctionContext\<unknown\> \| CustomFunctionContextCallback\<unknown\>\>

Defined in: [packages/core/src/utils/create-assistant.ts:171](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/core/src/utils/create-assistant.ts#L171)

Type guard to check if a tool is a Vercel function tool

## Parameters

### tool

The tool to check

[`RegisterFunctionCallingProps`](../type-aliases/RegisterFunctionCallingProps.md) | [`ExtendedTool`](../type-aliases/ExtendedTool.md)\<`never`, `never`, `never`, [`CustomFunctionContext`](../type-aliases/CustomFunctionContext.md)\<`unknown`\> \| [`CustomFunctionContextCallback`](../type-aliases/CustomFunctionContextCallback.md)\<`unknown`\>\>

## Returns

tool is ExtendedTool\<never, never, never, CustomFunctionContext\<unknown\> \| CustomFunctionContextCallback\<unknown\>\>

True if the tool is a Vercel function tool
