# Variable: spatialJoin

> `const` **spatialJoin**: `ExtendedTool`\<[`SpatialJoinFunctionArgs`](../type-aliases/SpatialJoinFunctionArgs.md), [`SpatialJoinLlmResult`](../type-aliases/SpatialJoinLlmResult.md), [`SpatialJoinAdditionalData`](../type-aliases/SpatialJoinAdditionalData.md), [`SpatialJoinFunctionContext`](../type-aliases/SpatialJoinFunctionContext.md)\>

Defined in: [packages/geoda/src/spatial\_join/tool.ts:100](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/geoda/src/spatial_join/tool.ts#L100)

The spatial join tool is used to join geometries from one dataset with geometries from another dataset.

The tool supports various join operations:
- sum: sum of values in overlapping geometries
- mean: average of values in overlapping geometries
- min: minimum value in overlapping geometries
- max: maximum value in overlapping geometries
- median: median value in overlapping geometries
- count: count of overlapping geometries

When user prompts e.g. *can you join the population data with county boundaries?*

1. The LLM will execute the callback function of spatialJoinFunctionDefinition, and perform the spatial join using the geometries retrieved from `getGeometries` function.
2. The result will include joined values and a new dataset with the joined geometries.
3. The LLM will respond with the join results and details about the new dataset.

### For example
```
User: can you join the population data with county boundaries?
LLM: I've performed a spatial join between the population data and county boundaries. The result shows the total population in each county...
```

### Code example
```typescript
import { getVercelAiTool } from '@openassistant/geoda';
import { generateText } from 'ai';

const toolContext = {
  getGeometries: (datasetName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
  },
  getValues: (datasetName, variableName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
  },
};
const joinTool = getVercelAiTool('spatialJoin', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you join the population data with county boundaries?',
  tools: {spatialJoin: joinTool},
});
```
