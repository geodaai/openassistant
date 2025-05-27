# Variable: getUsStateGeojson

> `const` **getUsStateGeojson**: `ExtendedTool`\<[`GetUsStateGeojsonFunctionArgs`](../type-aliases/GetUsStateGeojsonFunctionArgs.md), [`GetUsStateGeojsonLlmResult`](../type-aliases/GetUsStateGeojsonLlmResult.md), [`GetUsStateGeojsonAdditionalData`](../type-aliases/GetUsStateGeojsonAdditionalData.md), `object`\>

Defined in: [packages/tools/osm/src/us/state.ts:68](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/osm/src/us/state.ts#L68)

Get US State GeoJSON Tool

This tool can be used to get the GeoJSON data of one or more United States states using the Github repository: https://github.com/glynnbird/usstatesgeojson

Example user prompts:
- "Get the GeoJSON for California"
- "Show me the boundary of New York state"
- "What's the geometry of Texas?"

:::tip
This tool can be mixed with other tools for more complex tasks. For example, if you have a point datasets, you can use this tool
to answer questions like "What are the total revenus in the state of California?"
:::

:::note
to avoid overloading the Github API, we only fetch the GeoJSON data every 1 second.
:::

## Example

```typescript
import { getOsmTool, OsmToolNames } from "@openassistant/osm";

const stateTool = getOsmTool(OsmToolNames.getUsStateGeojson);

streamText({
  model: openai('gpt-4o'),
  prompt: 'Get the GeoJSON for California',
  tools: {
    state: stateTool,
  },
});
```

For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
