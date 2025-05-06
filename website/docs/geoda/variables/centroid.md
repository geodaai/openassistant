# Variable: centroid

> `const` **centroid**: `ExtendedTool`\<[`CentroidFunctionArgs`](../type-aliases/CentroidFunctionArgs.md), [`CentroidLlmResult`](../type-aliases/CentroidLlmResult.md), [`CentroidAdditionalData`](../type-aliases/CentroidAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/geoda/src/spatial\_ops/centroid.ts:65](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/geoda/src/spatial_ops/centroid.ts#L65)

The centroid tool is used to calculate the centroids (geometric centers) of geometries.

The tool supports:
- Calculating centroids from GeoJSON input
- Calculating centroids from geometries in a dataset
- Returns centroids as points that can be used for mapping

When user prompts e.g. *can you find the center points of these counties?*

1. The LLM will execute the callback function of centroidFunctionDefinition, and calculate the centroids using the geometries retrieved from `getGeometries` function.
2. The result will include the centroid points and a new dataset name for mapping.
3. The LLM will respond with the centroid calculation results and the new dataset name.

### For example
```
User: can you find the center points of these counties?
LLM: I've calculated the centroids of the counties. The centroid points are saved in dataset "centroid_123"...
```

### Code example
```typescript
import { getVercelAiTool } from '@openassistant/geoda';
import { generateText } from 'ai';

const toolContext = {
  getGeometries: (datasetName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
  },
};
const centroidTool = getVercelAiTool('centroid', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you find the center points of these counties?',
  tools: {centroid: centroidTool},
});
```
