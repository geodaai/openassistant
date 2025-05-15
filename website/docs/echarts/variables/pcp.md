# Variable: pcp

> `const` **pcp**: `ExtendedTool`\<[`PCPFunctionArgs`](../type-aliases/PCPFunctionArgs.md), [`PCPLlmResult`](../type-aliases/PCPLlmResult.md), [`PCPAdditionalData`](../type-aliases/PCPAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/echarts/src/pcp/tool.ts:48](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/echarts/src/pcp/tool.ts#L48)

The PCP tool is used to create a parallel coordinates plot.

## Example

```typescript
import { getVercelAiTool } from '@openassistant/plots';
import { generateText } from 'ai';

const toolContext = {
  getValues: async (datasetName, variableName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
  },
};

const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
  console.log('Tool call completed:', toolCallId, additionalData);
  // render the PCP using <ParallelCoordinateComponentContainer props={additionalData} />
};

const pcpTool = getVercelAiTool('pcp', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a PCP of the population and income?',
  tools: {pcp: pcpTool},
});
```

### getValues()

See PCPFunctionContext for detailed usage.

User implements this function to get the values of the variable from dataset.

For prompts like "_can you show a PCP of the revenue per capita for each location in dataset myVenues_", the tool will
call the `getValues()` function twice:
- get the values of **revenue** from dataset: getValues('myVenues', 'revenue')
- get the values of **population** from dataset: getValues('myVenues', 'population')
