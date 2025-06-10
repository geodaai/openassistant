# Variable: bubbleChart

> `const` **bubbleChart**: `ExtendedTool`\<[`BubbleChartToolArgs`](../type-aliases/BubbleChartToolArgs.md), [`BubbleChartLlmResult`](../type-aliases/BubbleChartLlmResult.md), [`BubbleChartAdditionalData`](../type-aliases/BubbleChartAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/tools/plots/src/echarts/bubble-chart/tool.ts:44](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/plots/src/echarts/bubble-chart/tool.ts#L44)

The bubble chart tool is used to create a bubble chart for a given dataset and variables.

**Example user prompts:**
- "Can you create a bubble chart of the population and income for each location in dataset myVenues, and use the size of the bubble to represent the revenue?"
- "Can you show a bubble chart of the population and income for each location in dataset myVenues, and use the size of the bubble to represent the revenue?"

## Example

```ts
import { bubbleChart, BubbleChartTool } from '@openassistant/plots';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const toolContext = {
  getValues: async (datasetName, variableName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
  },
};

const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
  console.log('Tool call completed:', toolCallId, additionalData);
  // render the bubble chart using <BubbleChartComponentContainer props={additionalData} />
};

const bubbleChartTool: BubbleChartTool = {
  ...bubbleChart,
  context: toolContext,
  onToolCompleted,
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a bubble chart of the population and income for each location in dataset myVenues, and use the size of the bubble to represent the revenue?',
  tools: {
    bubbleChart: convertToVercelAiTool(bubbleChartTool),
  },
});
```
