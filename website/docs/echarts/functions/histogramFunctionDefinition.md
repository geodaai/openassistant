# Function: histogramFunctionDefinition()

> **histogramFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [histogram/definition.ts:61](https://github.com/GeoDaCenter/openassistant/blob/2c73424721a2d454352fbebfbd647d2c7c73df8b/packages/echarts/src/histogram/definition.ts#L61)

Define the histogram function for tool calling. This function can assist user to create a histogram plot using the values of a variable in the dataset.
The values should be retrieved using the getValues() callback function.

User can select the bars in the histogram plot, and the selections can be synced back to the original dataset using the onSelected() callback.
See [OnSelectedCallback](../type-aliases/OnSelectedCallback.md) for more details.

## Parameters

### context

`CustomFunctionContext`\<`HistogramFunctionContextValues`\>

The context of the function. See [HistogramFunctionContext](../type-aliases/HistogramFunctionContext.md) for more details.

## Returns

`RegisterFunctionCallingProps`

The function definition.
