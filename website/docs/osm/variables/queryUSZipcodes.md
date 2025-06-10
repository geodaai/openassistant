# Variable: queryUSZipcodes

> `const` **queryUSZipcodes**: `ExtendedTool`\<[`QueryZipcodeFunctionArgs`](../type-aliases/QueryZipcodeFunctionArgs.md), [`QueryZipcodeLlmResult`](../type-aliases/QueryZipcodeLlmResult.md), [`QueryZipcodeAdditionalData`](../type-aliases/QueryZipcodeAdditionalData.md), `object`\>

Defined in: [packages/tools/osm/src/us/queryZipcode.ts:65](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/osm/src/us/queryZipcode.ts#L65)

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
import { queryUSZipcodes } from "@openassistant/osm";
import { convertToVercelAiTool } from '@openassistant/utils';

streamText({
  model: openai('gpt-4o'),
  prompt: 'what are the zipcodes in Los Angeles county?',
  tools: {
    queryZipcode: convertToVercelAiTool(queryUSZipcodes),
  },
});
```

For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
