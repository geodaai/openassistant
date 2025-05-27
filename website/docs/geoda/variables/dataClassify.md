# Variable: dataClassify

> `const` **dataClassify**: `ExtendedTool`\<[`DataClassifyFunctionArgs`](../type-aliases/DataClassifyFunctionArgs.md), [`DataClassifyLlmResult`](../type-aliases/DataClassifyLlmResult.md), [`DataClassifyAdditionalData`](../type-aliases/DataClassifyAdditionalData.md), [`DataClassifyFunctionContext`](../type-aliases/DataClassifyFunctionContext.md)\>

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:102](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/geoda/src/data-classify/tool.ts#L102)

The data classify tool is used to classify the data into k bins or classes.

The classification method can be one of the following types:
- quantile
- natural breaks
- equal interval
- percentile
- box
- standard deviation
- unique values.

**Example user prompts:**
- "Can you classify the data of population into 5 classes?"

## Example

```typescript
import { getGeoDaTool, GeoDaToolNames } from "@openassistant/geoda";

const classifyTool = getGeoDaTool(GeoDaToolNames.dataClassify, {
  toolContext: {
    getValues: async (datasetName: string, variableName: string) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log(toolCallId, additionalData);
  },
  isExecutable: true,
});

const result = await generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you classify the data of population into 5 classes?',
  tools: {dataClassify: classifyTool},
});

console.log(result);
```

For a more complete example, see the [Geoda Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_geoda_example).
