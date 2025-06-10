# Variable: pcp

> `const` **pcp**: `ExtendedTool`\<[`PCPFunctionArgs`](../type-aliases/PCPFunctionArgs.md), [`PCPLlmResult`](../type-aliases/PCPLlmResult.md), [`PCPAdditionalData`](../type-aliases/PCPAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/tools/plots/src/echarts/pcp/tool.ts:54](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/plots/src/echarts/pcp/tool.ts#L54)

The PCP tool is used to create a parallel coordinates plot for a given dataset and variables.

**Example user prompts:**
- "Can you create a PCP of the population and income for each location in dataset myVenues?"
- "What is the relationship between population and income?"
- "Can you show a PCP of the population and income for each location in dataset myVenues?"

## Example

```typescript
import { pcp, PCPTool } from '@openassistant/plots';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const toolContext = {
  getValues: async (datasetName, variableName) => {
    // get the values of the variable from dataset, e.g.
    return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
  },
};

const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
  console.log('Tool call completed:', toolCallId, additionalData);
  // render the PCP using <ParallelCoordinateComponentContainer props={additionalData} />
};

const pcpTool: PCPTool = {
  ...pcp,
  context: toolContext,
  onToolCompleted,
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you create a PCP of the population and income?',
  tools: {
    pcp: convertToVercelAiTool(pcpTool),
  },
});
```
