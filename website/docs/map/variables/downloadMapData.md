# Variable: downloadMapData

> `const` **downloadMapData**: `ExtendedTool`\<[`DownloadMapDataArgs`](../type-aliases/DownloadMapDataArgs.md), [`DownloadMapLlmResult`](../type-aliases/DownloadMapLlmResult.md), [`DownloadMapAdditionalData`](../type-aliases/DownloadMapAdditionalData.md), [`MapToolContext`](../type-aliases/MapToolContext.md)\>

Defined in: [packages/tools/map/src/data/tool.ts:72](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/map/src/data/tool.ts#L72)

The downloadMapData tool is used to download map data (GeoJson or CSV) from a url.

:::tip
Use this tool to download map data, you can cache the dataset in `onToolCompleted()`
callback. Other tools e.g. `keplergl` can use the downloaded dataset to create a map,
or query the downloaded dataset using `localQuery` tool.
:::

### Example
```typescript
import { downloadMapData, isDownloadMapAdditionalData, keplergl, KeplerglTool } from '@openassistant/map';
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { generateText } from 'ai';

const toolResultCache = ToolCache.getInstance();

const downloadMapTool = {
  ...downloadMapData,
  onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

const keplerglTool: KeplerglTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
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

* generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Create a from https://geodacenter.github.io/data-and-lab//data/Chi_Carjackings.geojson',
  tools: {
    createMap: convertToVercelAiTool(keplerglTool),
    downloadMapData: convertToVercelAiTool(downloadMapTool),
  },
});
