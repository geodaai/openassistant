# Variable: getUsCountyGeojson

> `const` **getUsCountyGeojson**: `ExtendedTool`\<[`GetUsCountyGeojsonFunctionArgs`](../type-aliases/GetUsCountyGeojsonFunctionArgs.md), [`GetUsCountyGeojsonLlmResult`](../type-aliases/GetUsCountyGeojsonLlmResult.md), [`GetUsCountyGeojsonAdditionalData`](../type-aliases/GetUsCountyGeojsonAdditionalData.md), `object`\>

Defined in: [packages/tools/osm/src/us/county.ts:76](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/osm/src/us/county.ts#L76)

Get US County GeoJSON Tool

This tool can be used to get the GeoJSON data of one or more United States counties using the Github repository: https://github.com/hyperknot/country-levels-export

:::note
to avoid overloading the Github API, we only fetch the GeoJSON data every 1 second.
:::

**Example user prompts:**
- "Get all counties in California"
- "Get all counties in current map view"
- "What are the counties in Texas?"

:::tip
This tool can be mixed with other tools for more complex tasks. For example, if you have a point datasets, you can use this tool
to answer questions like "What are the total revenus in the counties of California?"
:::

## Example

```typescript
import { getUsCountyGeojson, GetUsCountyGeojsonTool } from "@openassistant/osm";
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { generateText } from 'ai';

// you can use ToolCache to save the county geojson dataset for later use
const toolResultCache = ToolCache.getInstance();

const countyTool: GetUsCountyGeojsonTool = {
  ...getUsCountyGeojson,
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'What are the counties in Texas?',
  tools: {
    county: convertToVercelAiTool(countyTool),
  },
});
```
