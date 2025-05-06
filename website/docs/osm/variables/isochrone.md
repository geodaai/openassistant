# Variable: isochrone

> `const` **isochrone**: `ExtendedTool`\<[`IsochroneFunctionArgs`](../type-aliases/IsochroneFunctionArgs.md), [`IsochroneLlmResult`](../type-aliases/IsochroneLlmResult.md), [`IsochroneAdditionalData`](../type-aliases/IsochroneAdditionalData.md), `OsmToolContext`\>

Defined in: [isochrone.ts:100](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/osm/src/isochrone.ts#L100)

Isochrone Tool

This tool generates isochrone polygons showing reachable areas within a given time or distance limit
from a starting point using Mapbox's Isochrone API. It supports different transportation modes
and can return either polygons or linestrings.

Example user prompts:
- "Show me all areas reachable within 15 minutes of Times Square by car"
- "What areas can I reach within 2km of the Eiffel Tower on foot?"
- "Generate isochrones for a 30-minute cycling radius from Central Park"

Example code:
```typescript
import { getVercelAiTool } from "@openassistant/osm";

const isochroneTool = getVercelAiTool('isochrone');

generateText({
  model: 'gpt-4o-mini',
  prompt: 'What areas can I reach within 2km of the Eiffel Tower on foot?',
  tools: {isochrone: isochroneTool},
});
```
