# Function: boxplotFunctionDefinition()

> **boxplotFunctionDefinition**(`context`, `callbackMessage`): `RegisterFunctionCallingProps`

Defined in: [packages/echarts/src/boxplot/definition.ts:97](https://github.com/GeoDaCenter/openassistant/blob/7dec66552ed2da789768e26aca21ecb2918b5d3b/packages/echarts/src/boxplot/definition.ts#L97)

Define the boxplot function for tool calling. This function can assist user to create a boxplot using the values of a variable in the dataset.
The values should be retrieved using the getValues() callback function.

User can select data points in the boxplot, and the selections can be synced back to the original dataset using the onSelected() callback.
See [OnSelectedCallback](../type-aliases/OnSelectedCallback.md) for more details.

## Parameters

### context

`CustomFunctionContext`\<`BoxplotFunctionContextValues`\>

The context of the function. See [BoxplotFunctionContext](../type-aliases/BoxplotFunctionContext.md) for more details.

### callbackMessage

(`props`) => `ReactNode`

## Returns

`RegisterFunctionCallingProps`

The function definition.
