# Variable: boxplot

> `const` **boxplot**: `ExtendedTool`\<[`BoxplotToolArgs`](../type-aliases/BoxplotToolArgs.md), [`BoxplotLlmResult`](../type-aliases/BoxplotLlmResult.md), [`BoxplotAdditionalData`](../type-aliases/BoxplotAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/tools/plots/src/echarts/boxplot/tool.ts:49](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/plots/src/echarts/boxplot/tool.ts#L49)

The boxplot tool is used to create a box plot for a given dataset and variable.

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
  // render the boxplot using <BoxplotComponentContainer props={additionalData} />
};

const boxplotTool = getVercelAiTool('boxplot', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a box plot of the revenue per capita for each location in dataset myVenues?',
  tools: {boxplot: boxplotTool},
});
```

### getValues()

See BoxplotFunctionContext for detailed usage.

User implements this function to get the values of the variable from dataset.

For prompts like "_can you show a box plot of the revenue per capita for each location in dataset myVenues_", the tool will
call the `getValues()` function twice:
- get the values of **revenue** from dataset: getValues('myVenues', 'revenue')
- get the values of **population** from dataset: getValues('myVenues', 'population')

A duckdb table will be created using the values returned from `getValues()`, and LLM will generate a sql query to query the table to answer the user's prompt.
