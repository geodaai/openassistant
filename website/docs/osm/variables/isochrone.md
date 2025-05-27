# Variable: isochrone

> `const` **isochrone**: `ExtendedTool`\<[`IsochroneFunctionArgs`](../type-aliases/IsochroneFunctionArgs.md), [`IsochroneLlmResult`](../type-aliases/IsochroneLlmResult.md), [`IsochroneAdditionalData`](../type-aliases/IsochroneAdditionalData.md), [`MapboxToolContext`](../type-aliases/MapboxToolContext.md)\>

Defined in: [packages/tools/osm/src/isochrone.ts:108](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/osm/src/isochrone.ts#L108)

Isochrone Tool

This tool generates isochrone polygons showing reachable areas within a given time or distance limit
from a starting point using Mapbox's Isochrone API. It supports different transportation modes
and can return either polygons or linestrings.

:::tip
If you don't know the coordinates of the origin point, you can use the geocoding tool to get it.
:::

Example user prompts:
- "Show me all areas reachable within 15 minutes of Times Square by car"
- "What areas can I reach within 2km of the Eiffel Tower on foot?"
- "Generate isochrones for a 30-minute cycling radius from Central Park"

## Example

```typescript
import { getOsmTool, OsmToolNames } from "@openassistant/osm";

const geocodingTool = getOsmTool(OsmToolNames.geocoding);
const isochroneTool = getOsmTool(OsmToolNames.isochrone, {
  toolContext: {
    getMapboxToken: () => process.env.MAPBOX_TOKEN!,
  },
});

streamText({
  model: openai('gpt-4o'),
  prompt: 'What areas can I reach within 2km of the Eiffel Tower on foot?',
  tools: {
    isochrone: isochroneTool,
  },
});
```

For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
