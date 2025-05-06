# Variable: globalMoran

> `const` **globalMoran**: `ExtendedTool`\<[`MoranScatterPlotFunctionArgs`](../type-aliases/MoranScatterPlotFunctionArgs.md), [`MoranScatterPlotLlmResult`](../type-aliases/MoranScatterPlotLlmResult.md), [`MoranScatterPlotAdditionalData`](../type-aliases/MoranScatterPlotAdditionalData.md), [`MoranScatterPlotFunctionContext`](../type-aliases/MoranScatterPlotFunctionContext.md)\>

Defined in: [packages/geoda/src/moran-scatterplot/tool.ts:103](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/geoda/src/moran-scatterplot/tool.ts#L103)

The Moran scatterplot tool is used to create a scatterplot of spatial data and calculate Global Moran's I.

The tool creates a scatterplot where:
- X-axis represents the original variable values
- Y-axis represents the spatial lag values
- The slope of the regression line represents Global Moran's I

When user prompts e.g. *can you create a Moran scatterplot for the population data?*

1. The LLM will execute the callback function of moranScatterPlotFunctionDefinition, and create the scatterplot using the data retrieved from `getValues` function.
2. The result will include the Global Moran's I value and a scatterplot visualization.
3. The LLM will respond with the analysis results to the user.

### For example
```
User: can you create a Moran scatterplot for the population data?
LLM: I've created a Moran scatterplot for the population data. The Global Moran's I is 0.75, indicating strong positive spatial autocorrelation...
```

### Code example
```typescript
import { getVercelAiTool } from '@openassistant/geoda';
import { generateText } from 'ai';

const toolContext = {
  getValues: (datasetName, variableName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
  },
};

const moranTool = getVercelAiTool('globalMoran', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a Moran scatterplot for the population data?',
  tools: {globalMoran: moranTool},
});
```
