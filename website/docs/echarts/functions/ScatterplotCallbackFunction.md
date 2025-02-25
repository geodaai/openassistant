# Function: ScatterplotCallbackFunction()

> **ScatterplotCallbackFunction**(`__namedParameters`): `Promise`\<`CustomFunctionOutputProps`\<`ScatterplotOutputResult`, [`ScatterplotOutputData`](../type-aliases/ScatterplotOutputData.md)\>\>

Defined in: [scatterplot/callback-function.ts:113](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/echarts/src/scatterplot/callback-function.ts#L113)

The callback function for the scatterplot. When LLM calls the scatterplot function, it will be executed.
The result will be returned as a reponse of the function call to the LLM.

## Parameters

### \_\_namedParameters

`CallbackFunctionProps`

## Returns

`Promise`\<`CustomFunctionOutputProps`\<`ScatterplotOutputResult`, [`ScatterplotOutputData`](../type-aliases/ScatterplotOutputData.md)\>\>

The result of the function.
