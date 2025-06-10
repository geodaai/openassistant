# Variable: isochrone

> `const` **isochrone**: `ExtendedTool`\<[`IsochroneFunctionArgs`](../type-aliases/IsochroneFunctionArgs.md), [`IsochroneLlmResult`](../type-aliases/IsochroneLlmResult.md), [`IsochroneAdditionalData`](../type-aliases/IsochroneAdditionalData.md), [`MapboxToolContext`](../type-aliases/MapboxToolContext.md)\>

Defined in: [packages/tools/osm/src/isochrone.ts:114](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/osm/src/isochrone.ts#L114)

This Isochrone tool generates isochrone polygons showing reachable areas within a given time or distance limit
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
import { isochrone, IsochroneTool } from "@openassistant/osm";
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { generateText } from 'ai';

// you can use ToolCache to save the isochrone dataset for later use
const toolResultCache = ToolCache.getInstance();

const isochroneTool: IsochroneTool = {
  ...isochrone,
  toolContext: {
    getMapboxToken: () => process.env.MAPBOX_TOKEN!,
  },
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'What areas can I reach within 2km of the Eiffel Tower on foot?',
  tools: {
    isochrone: convertToVercelAiTool(isochroneTool),
  },
});
```

For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
