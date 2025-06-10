# Variable: getUsStateGeojson

> `const` **getUsStateGeojson**: `ExtendedTool`\<[`GetUsStateGeojsonFunctionArgs`](../type-aliases/GetUsStateGeojsonFunctionArgs.md), [`GetUsStateGeojsonLlmResult`](../type-aliases/GetUsStateGeojsonLlmResult.md), [`GetUsStateGeojsonAdditionalData`](../type-aliases/GetUsStateGeojsonAdditionalData.md), `object`\>

Defined in: [packages/tools/osm/src/us/state.ts:75](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/osm/src/us/state.ts#L75)

Get US State GeoJSON Tool

This tool can be used to get the GeoJSON data of one or more United States states using the Github repository: https://github.com/glynnbird/usstatesgeojson

Example user prompts:
- "Get the GeoJSON for California"
- "Get all states in current map view"

:::tip
This tool can be mixed with other tools for more complex tasks. For example, if you have a point datasets, you can use this tool
to answer questions like "What are the total revenus in the state of California?"
:::

:::note
to avoid overloading the Github API, we only fetch the GeoJSON data every 1 second.
:::

## Example

```typescript
import { getUsStateGeojson, GetUsStateGeojsonTool } from "@openassistant/osm";
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { generateText } from 'ai';

// you can use ToolCache to save the state geojson dataset for later use
const toolResultCache = ToolCache.getInstance();

const stateTool: GetUsStateGeojsonTool = {
  ...getUsStateGeojson,
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Get the GeoJSON for California',
  tools: {
    state: convertToVercelAiTool(stateTool),
  },
});
```
