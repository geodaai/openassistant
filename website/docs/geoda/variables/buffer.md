# Variable: buffer

> `const` **buffer**: `ExtendedTool`\<[`BufferFunctionArgs`](../type-aliases/BufferFunctionArgs.md), [`BufferLlmResult`](../type-aliases/BufferLlmResult.md), [`BufferAdditionalData`](../type-aliases/BufferAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/geoda/src/spatial\_ops/buffer.ts:75](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/geoda/src/spatial_ops/buffer.ts#L75)

The buffer tool is used to create buffer zones around geometries.

The tool supports:
- Creating buffers from GeoJSON input
- Creating buffers from geometries in a dataset
- Buffer distances in kilometers (KM) or miles (Mile)
- Configurable buffer smoothness (points per circle)

When user prompts e.g. *can you create a 5km buffer around these roads?*

1. The LLM will execute the callback function of bufferFunctionDefinition, and create buffers using the geometries retrieved from `getGeometries` function.
2. The result will include the buffered geometries and a new dataset name for mapping.
3. The LLM will respond with the buffer creation results and the new dataset name.

### For example
```
User: can you create a 5km buffer around these roads?
LLM: I've created 5km buffers around the roads. The buffered geometries are saved in dataset "buffer_123"...
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
const bufferTool = getVercelAiTool('buffer', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a 5km buffer around these roads?',
  tools: {buffer: bufferTool},
});
```

You can also use this tool with other tools, e.g. geocoding, so you don't need to provide the `getGeometries` function.
The geometries from geocoding tool will be used as the input for this tool.
