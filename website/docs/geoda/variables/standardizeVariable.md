# Variable: standardizeVariable

> `const` **standardizeVariable**: `ExtendedTool`\<[`StandardizeVariableToolArgs`](../type-aliases/StandardizeVariableToolArgs.md), [`StandardizeVariableToolLlmResult`](../type-aliases/StandardizeVariableToolLlmResult.md), [`StandardizeVariableToolAdditionalData`](../type-aliases/StandardizeVariableToolAdditionalData.md), [`StandardizeVariableToolContext`](../type-aliases/StandardizeVariableToolContext.md)\>

Defined in: [packages/tools/geoda/src/variable/tool.ts:90](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/variable/tool.ts#L90)

## standardizeVariable Tool

This tool is used to standardize the data of a variable using one of the following methods:

### Standardization Methods

- deviation from mean
- standardize MAD
- range adjust
- range standardize
- standardize (Z-score)

## Example Code
```ts
import { standardizeVariable, StandardizeVariableTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const standardizeVariableTool: StandardizeVariableTool = {
  ...standardizeVariable,
  context: {
    getValues: (datasetName, variableName) => {
      return getValues(datasetName, variableName);
    },
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Standardize the data of the variable "income" of the dataset "income_data" using the deviation from mean method',
  tools: { standardizeVariable: convertToVercelAiTool(standardizeVariableTool) },
});
```
