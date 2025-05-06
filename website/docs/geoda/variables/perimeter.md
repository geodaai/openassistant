# Variable: perimeter

> `const` **perimeter**: `ExtendedTool`\<[`PerimeterFunctionArgs`](../type-aliases/PerimeterFunctionArgs.md), [`PerimeterLlmResult`](../type-aliases/PerimeterLlmResult.md), [`PerimeterAdditionalData`](../type-aliases/PerimeterAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/geoda/src/spatial\_ops/perimeter.ts:58](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/geoda/src/spatial_ops/perimeter.ts#L58)

Perimeter Tool

This tool calculates the perimeter of geometries in a GeoJSON dataset.
It supports both direct GeoJSON input and dataset names, and can calculate
perimeters in either kilometers or miles.

Example user prompts:
- "Calculate the perimeter of these polygons in kilometers"
- "What is the total perimeter of these boundaries in miles?"
- "Measure the perimeter of these land parcels"

Example code:
```typescript
import { getVercelAiTool } from '@openassistant/geoda';
import { generateText } from 'ai';

const toolContext = {
  getGeometries: (datasetName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
  },
};
const perimeterTool = getVercelAiTool('perimeter', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Calculate the perimeter of these polygons in kilometers',
  tools: {perimeter: perimeterTool},
});
```
