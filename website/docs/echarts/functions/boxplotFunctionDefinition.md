# Function: boxplotFunctionDefinition()

> **boxplotFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [boxplot/definition.ts:58](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/echarts/src/boxplot/definition.ts#L58)

Define the boxplot function for tool calling. This function can assist user to create a boxplot using the values of a variable in the dataset.
The values should be retrieved using the getValues() callback function.

User can select data points in the boxplot, and the selections can be synced back to the original dataset using the onSelected() callback.
See [OnSelectedCallback](../type-aliases/OnSelectedCallback.md) for more details.

## Parameters

### context

`CustomFunctionContext`\<`BoxplotFunctionContextValues`\>

The context of the function. See [BoxplotFunctionContext](../type-aliases/BoxplotFunctionContext.md) for more details.

## Returns

`RegisterFunctionCallingProps`

The function definition.
