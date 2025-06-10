# Variable: buffer

> `const` **buffer**: `ExtendedTool`\<[`BufferFunctionArgs`](../type-aliases/BufferFunctionArgs.md), [`BufferLlmResult`](../type-aliases/BufferLlmResult.md), [`BufferAdditionalData`](../type-aliases/BufferAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/tools/geoda/src/spatial\_ops/buffer.ts:81](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/geoda/src/spatial_ops/buffer.ts#L81)

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
import { buffer, BufferTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const bufferTool: BufferTool = {
  ...buffer,
  context: {
    getGeometries: (datasetName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log(toolCallId, additionalData);
    // do something like save the buffer result in additionalData
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a 5km buffer around these roads?',
  tools: {buffer: convertToVercelAiTool(bufferTool)},
});
```

You can also use this tool with other tools, e.g. geocoding, so you don't need to provide the `getGeometries` function.
The geometries from geocoding tool will be used as the input for this tool.
