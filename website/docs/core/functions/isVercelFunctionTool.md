# Function: isVercelFunctionTool()

> **isVercelFunctionTool**(`tool`): `tool is ExtendedTool<never>`

Defined in: [utils/create-assistant.ts:157](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/core/src/utils/create-assistant.ts#L157)

Type guard to check if a tool is a Vercel function tool

## Parameters

### tool

The tool to check

[`OpenAIFunctionTool`](../type-aliases/OpenAIFunctionTool.md) | [`ExtendedTool`](../type-aliases/ExtendedTool.md)\<`never`\>

## Returns

`tool is ExtendedTool<never>`

True if the tool is a Vercel function tool
