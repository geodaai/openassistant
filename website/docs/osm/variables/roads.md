# Variable: roads

> `const` **roads**: `ExtendedTool`\<[`RoadsFunctionArgs`](../type-aliases/RoadsFunctionArgs.md), [`RoadsLlmResult`](../type-aliases/RoadsLlmResult.md), [`RoadsAdditionalData`](../type-aliases/RoadsAdditionalData.md), [`OsmToolContext`](../type-aliases/OsmToolContext.md)\>

Defined in: [packages/tools/osm/src/roads.ts:105](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/osm/src/roads.ts#L105)

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
import { roads, RoadsTool } from "@openassistant/osm";
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { generateText } from 'ai';

// you can use ToolCache to save the roads dataset for later use
const toolResultCache = ToolCache.getInstance();

const roadsTool: RoadsTool = {
  ...roads,
  context: {
    getGeometries: (datasetName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Show me all highways in New York City',
  tools: {
    roads: convertToVercelAiTool(roadsTool),
  },
});
```
