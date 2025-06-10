# Variable: scatterplot

> `const` **scatterplot**: `ExtendedTool`\<[`ScatterplotFunctionArgs`](../type-aliases/ScatterplotFunctionArgs.md), [`ScatterplotLlmResult`](../type-aliases/ScatterplotLlmResult.md), [`ScatterplotAdditionalData`](../type-aliases/ScatterplotAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/tools/plots/src/echarts/scatterplot/tool.ts:56](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/plots/src/echarts/scatterplot/tool.ts#L56)

The scatterplot tool is used to create a scatterplot chart for a given dataset and variables.

**Example user prompts:**
- "Can you create a scatter plot of the population and income for each location in dataset myVenues?"
- "What is the relationship between population and income?"
- "Can you show a scatter plot of the population and income for each location in dataset myVenues?"

## Example

```typescript
import { scatterplot, ScatterplotTool } from '@openassistant/plots';
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
  // render the scatterplot using <ScatterplotComponentContainer props={additionalData} />
};

const scatterplotTool: ScatterplotTool = {
  ...scatterplot,
  context: toolContext,
  onToolCompleted,
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'What is the relationship between population and income?',
  tools: {scatterplot: convertToVercelAiTool(scatterplotTool)},
});
```

### getValues()

See ScatterplotToolContext for detailed usage.

User implements this function to get the values of the variables from dataset.

For prompts like "_can you show a scatter plot of the population and income for each location in dataset myVenues_", the tool will
call the `getValues()` function twice:
- get the values of **population** from dataset: getValues('myVenues', 'population')
- get the values of **income** from dataset: getValues('myVenues', 'income')
