# Variable: histogram

> `const` **histogram**: `ExtendedTool`\<[`HistogramToolArgs`](../type-aliases/HistogramToolArgs.md), [`HistogramLlmResult`](../type-aliases/HistogramLlmResult.md), [`HistogramAdditionalData`](../type-aliases/HistogramAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/tools/plots/src/echarts/histogram/tool.ts:46](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/plots/src/echarts/histogram/tool.ts#L46)

The histogram tool is used to create a histogram chart for a given dataset and variable.

## Example

```typescript
import { histogram, HistogramTool } from '@openassistant/plots';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const toolContext = {
  getValues: async (datasetName: string, variableName: string) => {
    // get the values of the variable from dataset, e.g.
    return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
  },
};

const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
  console.log('Tool call completed:', toolCallId, additionalData);
  // render the histogram using <HistogramComponentContainer props={additionalData} />
};

const histogramTool: HistogramTool = {
  ...histogram,
  context: toolContext,
  onToolCompleted,
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a histogram of the revenue per capita for each location in dataset myVenues?',
  tools: {
    histogram: convertToVercelAiTool(histogramTool),
  },
});
```
