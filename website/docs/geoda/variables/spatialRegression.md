# Variable: spatialRegression

> `const` **spatialRegression**: `ExtendedTool`\<[`SpatialRegressionFunctionArgs`](../type-aliases/SpatialRegressionFunctionArgs.md), [`SpatialRegressionLlmResult`](../type-aliases/SpatialRegressionLlmResult.md), [`SpatialRegressionAdditionalData`](../type-aliases/SpatialRegressionAdditionalData.md), [`SpatialRegressionFunctionContext`](../type-aliases/SpatialRegressionFunctionContext.md)\>

Defined in: [packages/geoda/src/regression/tool.ts:79](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/geoda/src/regression/tool.ts#L79)

The spatial regression tool is used to perform regression analysis with spatial data.

The tool supports three types of regression models:
- Classic (OLS) regression
- Spatial lag model (accounting for spatial dependence in the dependent variable)
- Spatial error model (accounting for spatial dependence in the error term)

When user prompts e.g. *can you run a spatial regression analysis on the housing data?*

1. The LLM will execute the callback function of spatialRegressionFunctionDefinition, and perform the regression analysis using the data retrieved from `getValues` function.
2. The result will include regression coefficients, significance tests, and model diagnostics.
3. The LLM will respond with the analysis results and suggestions for model improvement.

### For example
```
User: can you run a spatial regression analysis on the housing data?
LLM: I've performed a spatial lag regression analysis on the housing data. The model shows significant spatial effects...
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

const regressionTool = getVercelAiTool('spatialRegression', toolContext, onToolCompleted);

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you run a spatial regression analysis of "revenue ~ population + income" on the data?',
  tools: {spatialRegression: regressionTool},
});
```
