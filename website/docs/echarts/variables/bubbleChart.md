# Variable: bubbleChart

> `const` **bubbleChart**: `ExtendedTool`\<[`BubbleChartToolArgs`](../type-aliases/BubbleChartToolArgs.md), [`BubbleChartLlmResult`](../type-aliases/BubbleChartLlmResult.md), [`BubbleChartAdditionalData`](../type-aliases/BubbleChartAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/echarts/src/bubble-chart/tool.ts:40](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/echarts/src/bubble-chart/tool.ts#L40)

The bubble chart tool.

To use it, you need to provide the implementation of the `getValues` function.

## Example

```ts
import { getVercelAiTool } from '@openassistant/plots';
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

const bubbleChartTool = getVercelAiTool('bubbleChart', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a bubble chart of the population and income for each location in dataset myVenues, and use the size of the bubble to represent the revenue?',
  tools: {bubbleChart: bubbleChartTool},
});
```

### getValues()

See BubbleChartFunctionContext for detailed usage.
