# Variable: roads

> `const` **roads**: `ExtendedTool`\<[`RoadsFunctionArgs`](../type-aliases/RoadsFunctionArgs.md), [`RoadsLlmResult`](../type-aliases/RoadsLlmResult.md), [`RoadsAdditionalData`](../type-aliases/RoadsAdditionalData.md), [`OsmToolContext`](../type-aliases/OsmToolContext.md)\>

Defined in: [packages/tools/osm/src/roads.ts:90](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/osm/src/roads.ts#L90)

Roads Tool

This tool queries OpenStreetMap's Overpass API to fetch road networks based on a boundary and road type.
The boundary can be specified as a bounding box (south,west,north,east) or a named area.
Road types can be: highway, pedestrian, residential, etc.

Example user prompts:
- "Get all highways in New York City"
- "Find pedestrian paths in Central Park"
- "Show me residential roads in San Francisco"

## Example

```typescript
import { getOsmTool, OsmToolNames } from "@openassistant/osm";

const roadsTool = getOsmTool(OsmToolNames.roads);

streamText({
  model: openai('gpt-4'),
  prompt: 'Show me all highways in New York City',
  tools: {
    roads: roadsTool,
  },
});
```
