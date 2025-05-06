# Variable: dataClassify

> `const` **dataClassify**: `ExtendedTool`\<[`DataClassifyFunctionArgs`](../type-aliases/DataClassifyFunctionArgs.md), [`DataClassifyLlmResult`](../type-aliases/DataClassifyLlmResult.md), [`DataClassifyAdditionalData`](../type-aliases/DataClassifyAdditionalData.md), [`DataClassifyFunctionContext`](../type-aliases/DataClassifyFunctionContext.md)\>

Defined in: [packages/geoda/src/data-classify/tool.ts:96](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/geoda/src/data-classify/tool.ts#L96)

The data classify tool is used to classify the data into k bins or classes.

The classification method can be one of the following types: quantile, natural breaks, equal interval, percentile, box, standard deviation, unique values.

When user prompts e.g. *can you classify the data of population into 5 classes?*

1. The LLM will execute the callback function of dataClassifyFunctionDefinition, and apply data classification using the data retrived from `getValues` function.
2. The result will be an array of break points, which can be used to classify the data into k bins or classes.
3. The LLM will respond with the break points to the user.

### For example
```
User: can you classify the data of population into 5 classes?
LLM:  Yes, I've used the quantile method to classify the data of population into 5 classes. The break points are [10000, 20000, 30000, 40000, 50000].
```

### Code example
```typescript
import { getVercelAiTool } from '@openassistant/geoda';
import { generateText } from 'ai';

const toolContext = {
  getValues: async (datasetName: string, variableName: string) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
  },
};

const classifyTool = getVercelAiTool('dataClassify', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you classify the data of population into 5 classes?',
  tools: {dataClassify: classifyTool},
});
```
