# Variable: getUsCountyGeojson

> `const` **getUsCountyGeojson**: `ExtendedTool`\<[`GetUsCountyGeojsonFunctionArgs`](../type-aliases/GetUsCountyGeojsonFunctionArgs.md), [`GetUsCountyGeojsonLlmResult`](../type-aliases/GetUsCountyGeojsonLlmResult.md), [`GetUsCountyGeojsonAdditionalData`](../type-aliases/GetUsCountyGeojsonAdditionalData.md), `never`\>

Defined in: [us/county.ts:51](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/osm/src/us/county.ts#L51)

Get US County GeoJSON Tool

This tool retrieves the GeoJSON data for all counties in a US state by its state code.
It returns the counties' boundary geometries and properties.

Example user prompts:
- "Get all counties in California"
- "Show me the county boundaries of New York state"
- "What are the counties in Texas?"

Example code:
```typescript
import { getVercelAiTool } from "@openassistant/osm";

const countyTool = getVercelAiTool('getUsCountyGeojson');

generateText({
  model: 'gpt-4o-mini',
  prompt: 'What are the counties in Texas?',
  tools: {getUsCountyGeojson: countyTool},
});
```
