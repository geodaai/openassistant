# Variable: perimeter

> `const` **perimeter**: `ExtendedTool`\<[`PerimeterFunctionArgs`](../type-aliases/PerimeterFunctionArgs.md), [`PerimeterLlmResult`](../type-aliases/PerimeterLlmResult.md), [`PerimeterAdditionalData`](../type-aliases/PerimeterAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/tools/geoda/src/spatial\_ops/perimeter.ts:62](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/geoda/src/spatial_ops/perimeter.ts#L62)

Perimeter Tool

This tool calculates the perimeter of geometries in a GeoJSON dataset.
It supports both direct GeoJSON input and dataset names, and can calculate
perimeters in either kilometers or miles.

Example user prompts:
- "Calculate the perimeter of these polygons in kilometers"
- "What is the total perimeter of these boundaries in miles?"
- "Measure the perimeter of these land parcels"

### Example

```typescript
import { perimeter, PerimeterTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const perimeterTool: PerimeterTool = {
  ...perimeter,
  context: {
    getGeometries: (datasetName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
    },
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Calculate the perimeter of these polygons in kilometers',
  tools: { perimeter: convertToVercelAiTool(perimeterTool) },
});
```
