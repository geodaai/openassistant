# Variable: keplergl

> `const` **keplergl**: `ExtendedTool`\<[`KeplerGlToolArgs`](../type-aliases/KeplerGlToolArgs-1.md), [`KeplerGlToolLlmResult`](../type-aliases/KeplerGlToolLlmResult.md), [`KeplerGlToolAdditionalData`](../type-aliases/KeplerGlToolAdditionalData.md), [`MapToolContext`](../type-aliases/MapToolContext.md)\>

Defined in: [packages/tools/map/src/keplergl/tool.ts:68](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/map/src/keplergl/tool.ts#L68)

The createMap tool is used to create a map visualization using Kepler.gl.

## Example

```typescript
import { getVercelAiTool } from '@openassistant/keplergl';
import { generateText } from 'ai';

const toolContext = {
  getDataset: async (datasetName: string) => {
    return YOUR_DATASET;
  },
};

const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
  console.log('Tool call completed:', toolCallId, additionalData);
  // render the map using <KeplerGlToolComponent props={additionalData} />
};

const createMapTool = getVercelAiTool('keplergl', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Create a point map using the dataset "my_venues"',
  tools: {createMap: createMapTool},
});
```

### getDataset()

User implements this function to get the dataset for visualization.

### config

User can configure the map visualization with options like:
- isDraggable: Whether the map is draggable
- theme: The theme of the map
