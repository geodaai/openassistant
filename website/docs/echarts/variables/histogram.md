# Variable: histogram

> `const` **histogram**: `ExtendedTool`\<[`HistogramToolArgs`](../type-aliases/HistogramToolArgs.md), [`HistogramLlmResult`](../type-aliases/HistogramLlmResult.md), [`HistogramAdditionalData`](../type-aliases/HistogramAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/echarts/src/histogram/tool.ts:47](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/echarts/src/histogram/tool.ts#L47)

The histogram tool is used to create a histogram chart.

## Example

```typescript
import { getVercelAiTool } from '@openassistant/echarts';
import { generateText } from 'ai';

const toolContext = {
  getValues: async (datasetName: string, variableName: string) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
  },
};

const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
  console.log('Tool call completed:', toolCallId, additionalData);
  // render the histogram using <HistogramComponentContainer props={additionalData} />
};

const histogramTool = getVercelAiTool('histogram', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a histogram of the revenue per capita for each location in dataset myVenues?',
  tools: {histogram: histogramTool},
});
```

### getValues()

See HistogramFunctionContext for detailed usage.

User implements this function to get the values of the variable from dataset.

For prompts like "_can you show a histogram of the revenue per capita for each location in dataset myVenues_", the tool will
call the `getValues()` function twice:
- get the values of **revenue** from dataset: getValues('myVenues', 'revenue')
- get the values of **population** from dataset: getValues('myVenues', 'population')

A duckdb table will be created using the values returned from `getValues()`, and LLM will generate a sql query to query the table to answer the user's prompt.
