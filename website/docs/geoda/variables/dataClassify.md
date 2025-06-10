# Variable: dataClassify

> `const` **dataClassify**: `ExtendedTool`\<[`DataClassifyFunctionArgs`](../type-aliases/DataClassifyFunctionArgs.md), [`DataClassifyLlmResult`](../type-aliases/DataClassifyLlmResult.md), [`DataClassifyAdditionalData`](../type-aliases/DataClassifyAdditionalData.md), [`DataClassifyFunctionContext`](../type-aliases/DataClassifyFunctionContext.md)\>

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:98](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/geoda/src/data-classify/tool.ts#L98)

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
import { dataClassify, DataClassifyTool } from "@openassistant/geoda";
import { convertToVercelAiTool } from "@openassistant/utils";

const classifyTool: DataClassifyTool = {
  ...dataClassify,
  toolContext: {
    getValues: async (datasetName: string, variableName: string) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

const result = await generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you classify the data of population into 5 classes?',
  tools: {dataClassify: convertToVercelAiTool(classifyTool)},
});

```

For a more complete example, see the [Geoda Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_geoda_example).
