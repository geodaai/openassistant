# Variable: routing

> `const` **routing**: `ExtendedTool`\<[`RoutingFunctionArgs`](../type-aliases/RoutingFunctionArgs.md), [`RoutingLlmResult`](../type-aliases/RoutingLlmResult.md), [`RoutingAdditionalData`](../type-aliases/RoutingAdditionalData.md), `OsmToolContext`\>

Defined in: [routing.ts:125](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/osm/src/routing.ts#L125)

Routing Tool

This tool calculates routes between two points using Mapbox's Directions API.
It supports different transportation modes (driving, walking, cycling) and returns
detailed route information including distance, duration, and turn-by-turn directions.

Example user prompts:
- "Find the driving route from Times Square to Central Park"
- "How do I walk from the Eiffel Tower to the Louvre?"
- "Get cycling directions from my current location to the nearest coffee shop"

Example code:
```typescript
import { routing, RoutingTool } from "@openassistant/osm";

const routingTool: RoutingTool = {
  ...routing,
  context: {
    getMapboxToken: () => "your-mapbox-token"
  }
};
```
