# Variable: getUsCountyGeojson

> `const` **getUsCountyGeojson**: `ExtendedTool`\<[`GetUsCountyGeojsonFunctionArgs`](../type-aliases/GetUsCountyGeojsonFunctionArgs.md), [`GetUsCountyGeojsonLlmResult`](../type-aliases/GetUsCountyGeojsonLlmResult.md), [`GetUsCountyGeojsonAdditionalData`](../type-aliases/GetUsCountyGeojsonAdditionalData.md), `object`\>

Defined in: [packages/tools/osm/src/us/county.ts:68](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/osm/src/us/county.ts#L68)

Get US County GeoJSON Tool

This tool can be used to get the GeoJSON data of one or more United States counties using the Github repository: https://github.com/hyperknot/country-levels-export

:::note
to avoid overloading the Github API, we only fetch the GeoJSON data every 1 second.
:::

**Example user prompts:**
- "Get all counties in California"
- "Show me the county boundaries of New York state"
- "What are the counties in Texas?"

:::tip
This tool can be mixed with other tools for more complex tasks. For example, if you have a point datasets, you can use this tool
to answer questions like "What are the total revenus in the counties of California?"
:::

## Example

```typescript
import { getOsmTool, OsmToolNames } from "@openassistant/osm";

const countyTool = getOsmTool(OsmToolNames.getUsCountyGeojson);

streamText({
  model: openai('gpt-4o'),
  prompt: 'What are the counties in Texas?',
  tools: {
    county: countyTool,
  },
});
```

For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
