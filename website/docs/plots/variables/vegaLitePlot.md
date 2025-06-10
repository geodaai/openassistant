# Variable: vegaLitePlot

> `const` **vegaLitePlot**: `ExtendedTool`\<[`VegaLitePlotToolArgs`](../type-aliases/VegaLitePlotToolArgs.md), [`VegaLitePlotLlmResult`](../type-aliases/VegaLitePlotLlmResult.md), [`VegaLitePlotAdditionalData`](../type-aliases/VegaLitePlotAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/tools/plots/src/vegalite/tool.ts:70](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/plots/src/vegalite/tool.ts#L70)

Tool to create a Vega plot from a dataset and variables.

There are many different plot types in Vega-Lite, you can find the full list of plot types [here](https://vega.github.io/vega-lite/docs/mark.html).

**Example user prompts:**
- "Can you create a bar chart of the population for each location in dataset myVenues?"
- "Can you show a bar chart of the population for each location in dataset myVenues?"

:::note
This tool is a browser-side tool.
:::

## Example

```ts
import { vegaLitePlot, VegaLitePlotTool } from '@openassistant/plots';
// import { VegaPlotComponent } from '@openassistant/vegalite';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const vegaLitePlotTool: VegaLitePlotTool = {
  ...vegaLitePlot,
  context: {
    getValues: async (datasetName, variableName) => {
      // get the values of the variable from dataset, e.g.
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log('Tool call completed:', toolCallId, additionalData);
    // render the Vega plot using <VegaPlotComponent props={additionalData} />
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a bar chart of the population for each location in dataset myVenues?',
  tools: {
    vegaLitePlot: convertToVercelAiTool(vegaLitePlotTool),
  },
});
```
