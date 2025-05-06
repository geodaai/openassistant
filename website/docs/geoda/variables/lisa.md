# Variable: lisa

> `const` **lisa**: `ExtendedTool`\<[`LisaFunctionArgs`](../type-aliases/LisaFunctionArgs.md), [`LisaLlmResult`](../type-aliases/LisaLlmResult.md), [`LisaAdditionalData`](../type-aliases/LisaAdditionalData.md), [`LisaFunctionContext`](../type-aliases/LisaFunctionContext.md)\>

Defined in: [packages/geoda/src/lisa/tool.ts:97](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/geoda/src/lisa/tool.ts#L97)

The LISA tool is used to apply local indicators of spatial association (LISA) statistics
to identify local clusters and spatial outliers.

The LISA method can be one of the following types: localMoran, localGeary, localG, localGStar, quantileLisa.

When user prompts e.g. *can you perform a LISA analysis on the population data?*

1. The LLM will execute the callback function of lisaFunctionDefinition, and apply LISA analysis using the data retrieved from `getValues` function.
2. The result will include clusters, significance values, and other spatial statistics.
3. The LLM will respond with the analysis results to the user.

### For example
```
User: can you perform a LISA analysis on the population data?
LLM: I've performed a Local Moran's I analysis on the population data. The results show several significant clusters...
```

### Code example
```typescript
import { getVercelAiTool } from '@openassistant/geoda';
import { generateText } from 'ai';

const toolContext = {
  getValues: (datasetName, variableName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
  },
};

const lisaTool = getVercelAiTool('lisa', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you perform a LISA analysis on the population data?',
  tools: {lisa: lisaTool},
});
```
