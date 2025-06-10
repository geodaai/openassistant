# Variable: globalMoran

> `const` **globalMoran**: `ExtendedTool`\<[`MoranScatterPlotFunctionArgs`](../type-aliases/MoranScatterPlotFunctionArgs.md), [`MoranScatterPlotLlmResult`](../type-aliases/MoranScatterPlotLlmResult.md), [`MoranScatterPlotAdditionalData`](../type-aliases/MoranScatterPlotAdditionalData.md), [`MoranScatterPlotFunctionContext`](../type-aliases/MoranScatterPlotFunctionContext.md)\>

Defined in: [packages/tools/geoda/src/global-moran/tool.ts:99](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/geoda/src/global-moran/tool.ts#L99)

The Global Moran's I tool is used to calculate Global Moran's I for a given variable to check if the variable is spatially clustered or dispersed.

**Example user prompts:**
- "Is the population data spatially clustered or dispersed?"
- "Is there a spatial autocorrelation in the population data?"
- "What is the Global Moran's I for the population data?"

:::note
The global Moran's I tool should always be used with the spatialWeights tool. The LLM models know how to use the spatialWeights tool for the Moran scatterplot analysis.
:::

## Example

```typescript
import { globalMoran, GlobalMoranTool, spatialWeights, SpatialWeightsTool } from "@openassistant/geoda";
import { convertToVercelAiTool } from "@openassistant/utils";

const spatialWeightsTool: SpatialWeightsTool = {
  ...spatialWeights,
  context: {
    getGeometries: async (datasetName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
    },
  },
});

const moranTool: GlobalMoranTool = {
  ...globalMoran,
  context: {
    getValues: async (datasetName, variableName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
});

const result = await generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you calculate the Global Moran\'s I for the population data?',
  tools: {
    globalMoran: convertToVercelAiTool(moranTool),
    spatialWeights: convertToVercelAiTool(spatialWeightsTool),
  },
});
```

:::tip
You can use the `MoranScatterPlotToolComponent` React component from the `@openassistant/components` package to visualize the Moran scatterplot using
the `additionalData` object returned by the tool.
:::

For a more complete example, see the [Geoda Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_geoda_example).
