# Variable: keplergl

> `const` **keplergl**: `ExtendedTool`\<[`KeplerGlToolArgs`](../type-aliases/KeplerGlToolArgs-1.md), [`KeplerGlToolLlmResult`](../type-aliases/KeplerGlToolLlmResult.md), [`KeplerGlToolAdditionalData`](../type-aliases/KeplerGlToolAdditionalData.md), [`KeplerglToolContext`](../type-aliases/KeplerglToolContext.md)\>

Defined in: [packages/map/src/keplergl.ts:60](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/map/src/keplergl.ts#L60)

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
