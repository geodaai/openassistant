# Variable: spatialWeights

> `const` **spatialWeights**: `ExtendedTool`\<[`SpatialWeightsFunctionArgs`](../type-aliases/SpatialWeightsFunctionArgs.md), [`SpatialWeightsLlmResult`](../type-aliases/SpatialWeightsLlmResult.md), [`SpatialWeightsAdditionalData`](../type-aliases/SpatialWeightsAdditionalData.md), [`SpatialWeightsFunctionContext`](../type-aliases/SpatialWeightsFunctionContext.md)\>

Defined in: [packages/tools/geoda/src/weights/tool.ts:88](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/geoda/src/weights/tool.ts#L88)

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
import { spatialWeights, SpatialWeightsTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const spatialWeightsTool: SpatialWeightsTool = {
  ...spatialWeights,
  context: {
    getGeometries: (datasetName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log(toolCallId, additionalData);
    // do something like save the weights result in additionalData
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Create a queen contiguity weights matrix for these counties',
  tools: {spatialWeights: convertToVercelAiTool(spatialWeightsTool)},
});
```
