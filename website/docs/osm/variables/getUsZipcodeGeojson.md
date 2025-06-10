# Variable: getUsZipcodeGeojson

> `const` **getUsZipcodeGeojson**: `ExtendedTool`\<[`GetUsZipcodeGeojsonFunctionArgs`](../type-aliases/GetUsZipcodeGeojsonFunctionArgs.md), [`GetUsZipcodeGeojsonLlmResult`](../type-aliases/GetUsZipcodeGeojsonLlmResult.md), [`GetUsZipcodeGeojsonAdditionalData`](../type-aliases/GetUsZipcodeGeojsonAdditionalData.md), `object`\>

Defined in: [packages/tools/osm/src/us/zipcode.ts:77](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/osm/src/us/zipcode.ts#L77)

Get US Zipcode GeoJSON Tool

This tool can be used to get the GeoJSON data of one or more United States zipcodes from the Github repository: https://github.com/greencoder/us-zipcode-to-geojson*

:::tip
This tool can be mixed with other tools for more complex tasks. For example, if you have a point datasets, you can use this tool
to answer questions like "What are the total revenus in the zipcode of 10001, 10002, 10003?"
:::

Example user prompts:
- "Get all zipcodes in California"
- "Show me the zipcode boundaries of New"

:::note
Note: to avoid overloading the Github API, we only fetch the GeoJSON data every 1 second.
:::

## Example

```typescript
import { getUsZipcodeGeojson, GetUsZipcodeGeojsonTool } from "@openassistant/osm";
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { generateText } from 'ai';

// you can use ToolCache to save the zipcode geojson dataset for later use
const toolResultCache = ToolCache.getInstance();

const zipcodeTool: GetUsZipcodeGeojsonTool = {
  ...getUsZipcodeGeojson,
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Get all zipcodes in California',
  tools: {
    zipcode: convertToVercelAiTool(zipcodeTool),
  },
});
```
