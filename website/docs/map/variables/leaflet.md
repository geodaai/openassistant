# Variable: leaflet

> `const` **leaflet**: `ExtendedTool`\<[`LeafletToolArgs`](../type-aliases/LeafletToolArgs.md), [`LeafletToolLlmResult`](../type-aliases/LeafletToolLlmResult.md), [`LeafletToolAdditionalData`](../type-aliases/LeafletToolAdditionalData.md), [`MapToolContext`](../type-aliases/MapToolContext.md)\>

Defined in: [packages/tools/map/src/leaflet/tool.ts:106](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/map/src/leaflet/tool.ts#L106)

The leaflet tool is used to create a leaflet map from GeoJSON data.

:::note
This tool should be used in Browser environment.
:::

### Example
```ts
import { leaflet, LeafletTool } from '@openassistant/map';
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { generateText } from 'ai';

const leafletTool: LeafletTool = {
  ...leaflet,
  context: {
    getDataset: async (datasetName) => {
      return YOUR_DATASET;
    },
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Create a leaflet map using the dataset "my_venues"',
  tools: {createMap: convertToVercelAiTool(leafletTool)},
});
```

:::tip
You can use the `downloadMapData` tool with the `leaflet` tool to download a dataset from a geojson from a url and use it to create a map.
:::

### Example
```ts
import { downloadMapData, isDownloadMapAdditionalData, leaflet, LeafletTool } from '@openassistant/map';
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { generateText } from 'ai';

const toolResultCache = ToolCache.getInstance();

const downloadMapTool = {
  ...downloadMapData,
  onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

const leafletTool: LeafletTool = {
  ...leaflet,
  context: {
    getDataset: async (datasetName) => {
      // find dataset based on datasetName first
      // return MYDATASETS[datasetName];

      // if no dataset is found, check if dataset is in toolResultCache
      if (toolResultCache.hasDataset(datasetName)) {
        return toolResultCache.getDataset(datasetName);
      }
      throw new Error(`Dataset ${datasetName} not found`);
    },
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Create a leaflet map using the dataset "my_venues"',
  tools: {createMap: convertToVercelAiTool(leafletTool), downloadMapData: convertToVercelAiTool(downloadMapTool)},
});
```
