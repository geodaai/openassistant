# Variable: getUsStateGeojson

> `const` **getUsStateGeojson**: `ExtendedTool`\<[`GetUsStateGeojsonFunctionArgs`](../type-aliases/GetUsStateGeojsonFunctionArgs.md), [`GetUsStateGeojsonLlmResult`](../type-aliases/GetUsStateGeojsonLlmResult.md), [`GetUsStateGeojsonAdditionalData`](../type-aliases/GetUsStateGeojsonAdditionalData.md), `never`\>

Defined in: [us/state.ts:48](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/osm/src/us/state.ts#L48)

Get US State GeoJSON Tool

This tool retrieves the GeoJSON data for a US state by its state code.
It returns the state's boundary geometry and properties.

Example user prompts:
- "Get the GeoJSON for California"
- "Show me the boundary of New York state"
- "What's the geometry of Texas?"

Example code:
```typescript
import { getUsStateGeojson, GetUsStateGeojsonTool } from "@openassistant/osm";

const stateTool: GetUsStateGeojsonTool = {
  ...getUsStateGeojson,
  context: {}
};
```
