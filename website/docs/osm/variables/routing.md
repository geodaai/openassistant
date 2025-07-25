# Variable: routing

> `const` **routing**: `ExtendedTool`\<[`RoutingFunctionArgs`](../type-aliases/RoutingFunctionArgs.md), [`RoutingLlmResult`](../type-aliases/RoutingLlmResult.md), [`RoutingAdditionalData`](../type-aliases/RoutingAdditionalData.md), [`MapboxToolContext`](../type-aliases/MapboxToolContext.md)\>

Defined in: [packages/tools/osm/src/routing.ts:138](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/osm/src/routing.ts#L138)

## Routing Tool

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

## Example

```typescript
import { geocoding, routing, RoutingTool, GeocodingTool } from "@openassistant/osm";
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { generateText } from 'ai';

// you can use ToolCache to save the routing dataset for later use
const toolResultCache = ToolCache.getInstance();

const routingTool: RoutingTool = {
  ...routing,
  toolContext: {
    getMapboxToken: () => process.env.MAPBOX_TOKEN!,
  },
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Find the driving route from Times Square to Central Park',
  tools: {
    geocoding: convertToVercelAiTool(geocoding),
    routing: convertToVercelAiTool(routingTool),
  },
});
```
