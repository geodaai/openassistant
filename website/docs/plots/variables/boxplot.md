# Variable: boxplot

> `const` **boxplot**: `ExtendedTool`\<[`BoxplotToolArgs`](../type-aliases/BoxplotToolArgs.md), [`BoxplotLlmResult`](../type-aliases/BoxplotLlmResult.md), [`BoxplotAdditionalData`](../type-aliases/BoxplotAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/tools/plots/src/echarts/boxplot/tool.ts:51](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/plots/src/echarts/boxplot/tool.ts#L51)

The boxplot tool is used to create a box plot for a given dataset and variable.

**Example user prompts:**
- "Can you create a box plot of the revenue per capita for each location in dataset myVenues?"
- "Can you show a box plot of the revenue per capita for each location in dataset myVenues?"

## Example

```typescript
import { boxplot, BoxplotTool } from '@openassistant/plots';
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
  // render the boxplot using <BoxplotComponentContainer props={additionalData} />
};

const boxplotTool: BoxplotTool = {
  ...boxplot,
  context: toolContext,
  onToolCompleted,
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a box plot of the revenue per capita for each location in dataset myVenues?',
  tools: {
    boxplot: convertToVercelAiTool(boxplotTool),
  },
});
```
