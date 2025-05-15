# Variable: scatterplot

> `const` **scatterplot**: `ExtendedTool`\<[`ScatterplotFunctionArgs`](../type-aliases/ScatterplotFunctionArgs.md), [`ScatterplotLlmResult`](../type-aliases/ScatterplotLlmResult.md), [`ScatterplotAdditionalData`](../type-aliases/ScatterplotAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/echarts/src/scatterplot/tool.ts:49](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/echarts/src/scatterplot/tool.ts#L49)

The scatterplot tool is used to create a scatterplot chart.

## Example

```typescript
import { getVercelAiTool } from '@openassistant/plots';
import { generateText } from 'ai';

const toolContext = {
  getValues: async (datasetName: string, variableName: string) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
  },
};

const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
  console.log('Tool call completed:', toolCallId, additionalData);
  // render the scatterplot using <ScatterplotComponentContainer props={additionalData} />
};

const scatterplotTool = getVercelAiTool('scatterplot', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'What is the relationship between population and income?',
  tools: {scatterplot: scatterplotTool},
});
```

:::tip
User: can you create a scatter plot using 'population' and 'income'?
:::

### getValues()

See ScatterplotToolContext for detailed usage.

User implements this function to get the values of the variables from dataset.

For prompts like "_can you show a scatter plot of the population and income for each location in dataset myVenues_", the tool will
call the `getValues()` function twice:
- get the values of **population** from dataset: getValues('myVenues', 'population')
- get the values of **income** from dataset: getValues('myVenues', 'income')
