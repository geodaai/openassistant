# Function: convertOpenAIToolsToVercelTools()

> **convertOpenAIToolsToVercelTools**(`tools`): `ToolSet`

Defined in: [lib/tool-utils.ts:9](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/lib/tool-utils.ts#L9)

Converts OpenAI tool format to Vercel AI SDK tool format

## Parameters

### tools

`ToolSet`

Object containing OpenAI function tools

## Returns

`ToolSet`

Converted tools in Vercel AI SDK format

## Throws

If any tool is not of type 'function'
