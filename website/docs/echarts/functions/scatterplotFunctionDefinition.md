# Function: scatterplotFunctionDefinition()

> **scatterplotFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [scatterplot/definition.ts:69](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/echarts/src/scatterplot/definition.ts#L69)

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
