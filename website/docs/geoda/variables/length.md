# Variable: length

> `const` **length**: `ExtendedTool`\<`ZodObject`\<\{ `datasetName`: `ZodOptional`\<`ZodString`\>; `distanceUnit`: `ZodDefault`\<`ZodEnum`\<\[`"KM"`, `"Mile"`\]\>\>; `geojson`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `datasetName`: `string`; `distanceUnit`: `"KM"` \| `"Mile"`; `geojson`: `string`; \}, \{ `datasetName`: `string`; `distanceUnit`: `"KM"` \| `"Mile"`; `geojson`: `string`; \}\>, \{ `distanceUnit`: `"KM"` \| `"Mile"`; `lengths`: `number`[]; `result`: `string`; `success`: `boolean`; \}, `never`, \{ `getGeometries`: () => `void`; \}\>

Defined in: [packages/tools/geoda/src/spatial\_ops/length.ts:60](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/geoda/src/spatial_ops/length.ts#L60)

Length Tool

This tool calculates the length of geometries in a GeoJSON dataset.
It supports both direct GeoJSON input and dataset names, and can calculate
lengths in either kilometers or miles.

Example user prompts:
- "Calculate the length of these roads in kilometers"
- "What is the total length of the river network in miles?"
- "Measure the length of these boundaries"

Example code:
```typescript
import { length, LengthTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const lengthTool: LengthTool = {
  ...length,
  context: {
    getGeometries: (datasetName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
    },
  },
});

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Calculate the length of these roads in kilometers',
  tools: {length: convertToVercelAiTool(lengthTool)},
});
```
