# Variable: keplergl

> `const` **keplergl**: `ExtendedTool`\<[`KeplerGlToolArgs`](../type-aliases/KeplerGlToolArgs-1.md), [`KeplerGlToolLlmResult`](../type-aliases/KeplerGlToolLlmResult.md), [`KeplerGlToolAdditionalData`](../type-aliases/KeplerGlToolAdditionalData.md), [`MapToolContext`](../type-aliases/MapToolContext.md)\>

Defined in: [packages/tools/map/src/keplergl/tool.ts:105](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/map/src/keplergl/tool.ts#L105)

The keplergl tool is used to create a map using Kepler.gl from a dataset.

:::note
This tool should be used in Browser environment.
:::

### Example
```typescript
import { keplergl, KeplerglTool } from '@openassistant/map';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const keplerglTool: KeplerglTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
      return YOUR_DATASET;
    },
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Create a point map using the dataset "my_venues"',
  tools: {createMap: convertToVercelAiTool(keplerglTool)},
});
```

:::tip
You can use the `downloadMapData` tool with the `keplergl` tool to download a dataset from a geojson or csv from a url and use it to create a map.
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
      // find dataset based on datasetName
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
```
