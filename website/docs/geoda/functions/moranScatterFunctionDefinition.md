# Function: moranScatterFunctionDefinition()

> **moranScatterFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [packages/geoda/src/moran-scatterplot/definition.ts:65](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/geoda/src/moran-scatterplot/definition.ts#L65)

Define the scatterplot function for tool calling. This function can assist user to create a scatterplot using the values of two variables in the dataset.
The values of x and y should be retrieved using the getValues() callback function.

User can select the points in the scatterplot, and the selections can be synced back to the original dataset using the onSelected() callback.
See OnSelectedCallback for more details.

## Parameters

### context

`CustomFunctionContext`\<[`MoranScatterFunctionContextValues`](../type-aliases/MoranScatterFunctionContextValues.md)\>

The context of the function. See ScatterplotFunctionContext for more details.

## Returns

`RegisterFunctionCallingProps`

The function definition.
