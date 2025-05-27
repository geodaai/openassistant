# Variable: lisa

> `const` **lisa**: `ExtendedTool`\<[`LisaFunctionArgs`](../type-aliases/LisaFunctionArgs.md), [`LisaLlmResult`](../type-aliases/LisaLlmResult.md), [`LisaAdditionalData`](../type-aliases/LisaAdditionalData.md), [`LisaFunctionContext`](../type-aliases/LisaFunctionContext.md)\>

Defined in: [packages/tools/geoda/src/lisa/tool.ts:112](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/geoda/src/lisa/tool.ts#L112)

The LISA tool is used to apply local indicators of spatial association (LISA) statistics
to identify local clusters and spatial outliers.

The LISA method can be one of the following types: localMoran, localGeary, localG, localGStar, quantileLisa.

**Example user prompts:**
- "Are young population clustering over the zipcode areas?"
- "Can you perform a local Moran's I analysis on the population data?"
- "What are the local clusters in the population data?"
- "How many significant clusters are there in the population data?"

:::note
The LISA tool should always be used with the spatialWeights tool. The LLM models know how to use the spatialWeights tool for the LISA analysis.
:::

## Example

```typescript
import { getGeoDaTool, GeoDaToolNames } from "@openassistant/geoda";

const spatialWeightsTool = getGeoDaTool(GeoDaToolNames.spatialWeights, {
  toolContext: {
    getGeometries: (datasetName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log(toolCallId, additionalData);
  },
  isExecutable: true,
});

const lisaTool = getGeoDaTool(GeoDaToolNames.lisa, {
  toolContext: {
    getValues: (datasetName, variableName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log(toolCallId, additionalData);
  },
  isExecutable: true,
});

const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Can you perform a local Moran analysis on the population data?',
  tools: {lisa: lisaTool, spatialWeights: spatialWeightsTool},
});

console.log(result);
```

For a more complete example, see the [Geoda Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_geoda_example).
