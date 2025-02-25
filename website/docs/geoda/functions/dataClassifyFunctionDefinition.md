# Function: dataClassifyFunctionDefinition()

> **dataClassifyFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [packages/geoda/src/data-classify.ts:77](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/geoda/src/data-classify.ts#L77)

The definition of the data classify function. The function tool can be used to classify the data into k bins or classes.
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
import { AiAssistant, dataClassifyFunctionDefinition } from "ai-assistant";

const functionTools = [dataClassifyFunctionDefinition({
  getValues: (datasetName, variableName) => {
    // return the values of the variable from the dataset in your react app
    return [];
  }
})];

<AiAssistant
  modelProvider="openai",
  modelName="gpt-4o",
  function={functionTools}
>
</AiAssistant>
```

## Parameters

### context

`CustomFunctionContext`\<`GetValues`\>

The context of the data classify function. See [DataClassifyFunctionContextValues](../type-aliases/DataClassifyFunctionContextValues.md) for more details.

## Returns

`RegisterFunctionCallingProps`

The definition of the data classify function.
