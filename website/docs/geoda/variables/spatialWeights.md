# Variable: spatialWeights

> `const` **spatialWeights**: `ExtendedTool`\<[`SpatialWeightsFunctionArgs`](../type-aliases/SpatialWeightsFunctionArgs.md), [`SpatialWeightsLlmResult`](../type-aliases/SpatialWeightsLlmResult.md), [`SpatialWeightsAdditionalData`](../type-aliases/SpatialWeightsAdditionalData.md), [`SpatialWeightsFunctionContext`](../type-aliases/SpatialWeightsFunctionContext.md)\>

Defined in: [packages/geoda/src/weights/tool.ts:78](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/geoda/src/weights/tool.ts#L78)

Spatial Weights Tool

This tool creates spatial weights matrices for spatial analysis. It supports multiple types of weights:
- K-Nearest Neighbors (knn)
- Queen Contiguity
- Rook Contiguity
- Distance-based Threshold

The weights are cached in memory using a unique ID generated from the input parameters.

Example user prompts:
- "Create a queen contiguity weights matrix for these counties"
- "Generate k-nearest neighbor weights with k=5 for these points"
- "Calculate distance-based weights with a 10km threshold"

Example code:
```typescript
import { getVercelAiTool } from '@openassistant/geoda';
import { generateText } from 'ai';

const toolContext = {
  getGeometries: (datasetName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
  },
};
const weightsTool = getVercelAiTool('spatialWeights', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Create a queen contiguity weights matrix for these counties',
  tools: {spatialWeights: weightsTool},
});
```
