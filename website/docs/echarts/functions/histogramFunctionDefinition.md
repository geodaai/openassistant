# Function: histogramFunctionDefinition()

> **histogramFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [histogram/definition.ts:58](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/echarts/src/histogram/definition.ts#L58)

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
