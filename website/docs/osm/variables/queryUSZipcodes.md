# Variable: queryUSZipcodes

> `const` **queryUSZipcodes**: `ExtendedTool`\<[`QueryZipcodeFunctionArgs`](../type-aliases/QueryZipcodeFunctionArgs.md), [`QueryZipcodeLlmResult`](../type-aliases/QueryZipcodeLlmResult.md), [`QueryZipcodeAdditionalData`](../type-aliases/QueryZipcodeAdditionalData.md), `never`\>

Defined in: [packages/osm/src/us/queryZipcode.ts:65](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/osm/src/us/queryZipcode.ts#L65)

Query US Zipcodes Tool

This tool can be used to query US zipcodes within a given map bounds using the zipcode centroids geojson data from the Github repository: https://github.com/GeoDaCenter/data-and-lab

:::tip
This tool can be mixed with other tools for more complex tasks. For example, if you have a point datasets, you can use this tool
to answer questions like "What are the total revenus in the zipcodes in current map view?"
:::

Example user prompts:
- "Find all zipcodes in current map view"
- "What zipcodes are in the Los Angeles county?"
- "Get zipcodes within this map view"

## Example

```typescript
import { getOsmTool, OsmToolNames } from "@openassistant/osm";

const queryZipcodeTool = getOsmTool(OsmToolNames.queryUSZipcodes);

streamText({
  model: openai('gpt-4o'),
  prompt: 'what are the zipcodes in Los Angeles county?',
  tools: {
    queryZipcode: queryZipcodeTool,
  },
});
```

For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
