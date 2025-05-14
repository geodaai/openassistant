# Variable: dissolve

> `const` **dissolve**: `ExtendedTool`\<[`DissolveFunctionArgs`](../type-aliases/DissolveFunctionArgs.md), [`DissolveLlmResult`](../type-aliases/DissolveLlmResult.md), [`DissolveAdditionalData`](../type-aliases/DissolveAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/geoda/src/spatial\_ops/dissolve.ts:67](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/geoda/src/spatial_ops/dissolve.ts#L67)

The dissolve tool is used to merge multiple geometries into a single geometry.

The tool supports:
- Dissolving geometries from GeoJSON input
- Dissolving geometries from a dataset
- Returns a single merged geometry that can be used for mapping

When user prompts e.g. *can you merge these counties into a single region?*

1. The LLM will execute the callback function of dissolveFunctionDefinition, and merge the geometries using the data retrieved from `getGeometries` function.
2. The result will include the merged geometry and a new dataset name for mapping.
3. The LLM will respond with the dissolve results and the new dataset name.

### For example
```
User: can you merge these counties into a single region?
LLM: I've merged the counties into a single region. The merged geometry is saved in dataset "dissolve_123"...
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
const dissolveTool = getVercelAiTool('dissolve', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
      // return the geometries from the dataset
      return [];
    }
  }
};
```
