# Variable: length

> `const` **length**: `ExtendedTool`\<`ZodObject`\<\{ `datasetName`: `ZodOptional`\<`ZodString`\>; `distanceUnit`: `ZodDefault`\<`ZodEnum`\<\[`"KM"`, `"Mile"`\]\>\>; `geojson`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `datasetName`: `string`; `distanceUnit`: `"KM"` \| `"Mile"`; `geojson`: `string`; \}, \{ `datasetName`: `string`; `distanceUnit`: `"KM"` \| `"Mile"`; `geojson`: `string`; \}\>, \{ `distanceUnit`: `"KM"` \| `"Mile"`; `lengths`: `number`[]; `result`: `string`; `success`: `boolean`; \}, `never`, \{ `getGeometries`: () => `void`; \}\>

Defined in: [packages/geoda/src/spatial\_ops/length.ts:57](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/geoda/src/spatial_ops/length.ts#L57)

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
import { getVercelAiTool } from '@openassistant/geoda';
import { generateText } from 'ai';

const toolContext = {
  getGeometries: (datasetName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
  },
};
const lengthTool = getVercelAiTool('length', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Calculate the length of these roads in kilometers',
  tools: {length: lengthTool},
});
```
