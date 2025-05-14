# Variable: isochrone

> `const` **isochrone**: `ExtendedTool`\<[`IsochroneFunctionArgs`](../type-aliases/IsochroneFunctionArgs.md), [`IsochroneLlmResult`](../type-aliases/IsochroneLlmResult.md), [`IsochroneAdditionalData`](../type-aliases/IsochroneAdditionalData.md), [`OsmToolContext`](../type-aliases/OsmToolContext.md)\>

Defined in: [packages/osm/src/isochrone.ts:107](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/osm/src/isochrone.ts#L107)

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
