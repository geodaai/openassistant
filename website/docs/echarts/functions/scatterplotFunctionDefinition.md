# Function: scatterplotFunctionDefinition()

> **scatterplotFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [packages/echarts/src/scatterplot/definition.ts:71](https://github.com/GeoDaCenter/openassistant/blob/7dec66552ed2da789768e26aca21ecb2918b5d3b/packages/echarts/src/scatterplot/definition.ts#L71)

Define the scatterplot function for tool calling. This function can assist user to create a scatterplot using the values of two variables in the dataset.
The values of x and y should be retrieved using the getValues() callback function.

User can select the points in the scatterplot, and the selections can be synced back to the original dataset using the onSelected() callback.
See [OnSelectedCallback](../type-aliases/OnSelectedCallback.md) for more details.

## Parameters

### context

`CustomFunctionContext`\<[`ScatterplotFunctionContextValues`](../type-aliases/ScatterplotFunctionContextValues.md)\>

The context of the function. See [ScatterplotFunctionContext](../type-aliases/ScatterplotFunctionContext.md) for more details.

## Returns

`RegisterFunctionCallingProps`

The function definition.
