# Variable: dissolve

> `const` **dissolve**: `ExtendedTool`\<[`DissolveFunctionArgs`](../type-aliases/DissolveFunctionArgs.md), [`DissolveLlmResult`](../type-aliases/DissolveLlmResult.md), [`DissolveAdditionalData`](../type-aliases/DissolveAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/tools/geoda/src/spatial\_ops/dissolve.ts:87](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/spatial_ops/dissolve.ts#L87)

## dissolve Tool

This tool is used to merge multiple geometries into a single geometry.

### Dissolve Function

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
```

### Code example
```typescript
import { dissolve, DissolveTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const dissolveTool: DissolveTool = {
  ...dissolve,
  context: {
    getGeometries: (datasetName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log(toolCallId, additionalData);
    // do something like save the dissolve result in additionalData
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you merge these counties into a single region?',
  tools: {dissolve: convertToVercelAiTool(dissolveTool)},
});
```
