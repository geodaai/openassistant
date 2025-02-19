# Function: boxplotFunctionDefinition()

> **boxplotFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [boxplot/definition.ts:58](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/echarts/src/boxplot/definition.ts#L58)

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
