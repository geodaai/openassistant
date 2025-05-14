# Variable: routing

> `const` **routing**: `ExtendedTool`\<[`RoutingFunctionArgs`](../type-aliases/RoutingFunctionArgs.md), [`RoutingLlmResult`](../type-aliases/RoutingLlmResult.md), [`RoutingAdditionalData`](../type-aliases/RoutingAdditionalData.md), [`OsmToolContext`](../type-aliases/OsmToolContext.md)\>

Defined in: [packages/osm/src/routing.ts:131](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/osm/src/routing.ts#L131)

Routing Tool

This tool calculates routes between two points using Mapbox's Directions API.
It supports different transportation modes (driving, walking, cycling) and returns
detailed route information including distance, duration, and turn-by-turn directions.

:::tip
If you don't know the coordinates of the origin or destination point, you can use the geocoding tool to get it.
:::

Example user prompts:
- "Find the driving route from Times Square to Central Park"
- "How do I walk from the Eiffel Tower to the Louvre?"
- "Get cycling directions from my current location to the nearest coffee shop"

Example code:
```typescript
import { getOsmTool, OsmToolNames } from "@openassistant/osm";

const geocodingTool = getOsmTool(OsmToolNames.geocoding);
const routingTool = getOsmTool(OsmToolNames.routing, {
  toolContext: {
    getMapboxToken: () => process.env.MAPBOX_TOKEN!,
  },
});

streamText({
  model: openai('gpt-4o'),
  prompt: 'Find the driving route from Times Square to Central Park',
  tools: {
    geocoding: geocodingTool,
    routing: routingTool,
  },
});
```

For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
