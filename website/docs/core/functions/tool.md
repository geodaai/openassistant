# Function: tool()

> **tool**\<`PARAMETERS`\>(`tool`): [`ExtendedTool`](../type-aliases/ExtendedTool.md)\<`PARAMETERS`\>

Defined in: [utils/create-assistant.ts:131](https://github.com/GeoDaCenter/openassistant/blob/a5eebdb32e6bf1b6b4eedf634485568edcefaa57/packages/core/src/utils/create-assistant.ts#L131)

Extends the vercel AI tool (see https://sdk.vercel.ai/docs/reference/ai-sdk-core/tool) with additional properties:

- **execute**: updated execute function that returns `{llmResult, output}`, where `llmResult` will be sent back to the LLM and `output` (optional) will be used for next tool call or tool component rendering
- **context**: get additional context for the tool execution, e.g. data that needs to be fetched from the server 
- **component**: tool component (e.g. chart or map) can be rendered as additional information of LLM response

### Example: 

```ts
{
   weather: tool({
     description: 'Get the weather in a location',
     parameters: z.object({
       location: z.string().describe('The location to get the weather for'),
     }),
     execute: async ({ location }) => {
       // get the weather from the weather API
       // the result should contains llmResult and output
       // `llmResult` will be sent back to the LLM
       // `output` (optional) will be used for next tool call or tool component rendering
       return {
         llmResult: 'Weather in ' + location,
         output: {
           temperature: 72 + Math.floor(Math.random() * 21) - 10,
         },
       };
     },
   }),
 },
```

## Type Parameters

• **PARAMETERS** *extends* `Parameters` = `never`

## Parameters

### tool

[`ExtendedTool`](../type-aliases/ExtendedTool.md)\<`PARAMETERS`\>

The vercel AI tool to extend

## Returns

[`ExtendedTool`](../type-aliases/ExtendedTool.md)\<`PARAMETERS`\>

The extended tool
