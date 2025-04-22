# Type Alias: DataClassifyTool

> **DataClassifyTool**: *typeof* [`dataClassify`](../variables/dataClassify.md)

Defined in: [packages/geoda/src/data-classify/tool.ts:118](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/data-classify/tool.ts#L118)

The type of the data classify tool.

The function tool can be used to classify the data into k bins or classes.
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
import { AiAssistant, dataClassify, DataClassifyTool } from "ai-assistant";

const classifyTool: DataClassifyTool = {
  ...dataClassify,
  context: {
    ...dataClassify.context,
    getValues: (datasetName, variableName) => {
      // return the values of the variable from the dataset
      return [];
    }
  }
};

<AiAssistant
  modelProvider="openai",
  modelName="gpt-4o",
  apiKey="your-api-key",
  tool={classifyTool}
/>
```
