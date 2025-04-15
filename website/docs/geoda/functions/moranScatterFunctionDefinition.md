# Function: ~~moranScatterFunctionDefinition()~~

> **moranScatterFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [packages/geoda/src/moran-scatterplot/definition.ts:28](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/geoda/src/moran-scatterplot/definition.ts#L28)

**`Internal`**

## Parameters

### context

`CustomFunctionContext`\<[`MoranScatterFunctionContextValues`](../type-aliases/MoranScatterFunctionContextValues.md)\>

## Returns

`RegisterFunctionCallingProps`

## Deprecated

Use [moranScatterPlot](../variables/moranScatterPlot.md) tool instead.

Define the scatterplot function for tool calling. This function can assist user to create a scatterplot using the values of two variables in the dataset.
The values of x and y should be retrieved using the getValues() callback function.
