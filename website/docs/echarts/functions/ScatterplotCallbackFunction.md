# Function: ScatterplotCallbackFunction()

> **ScatterplotCallbackFunction**(`__namedParameters`): `Promise`\<`CustomFunctionOutputProps`\<`ScatterplotOutputResult`, [`ScatterplotOutputData`](../type-aliases/ScatterplotOutputData.md)\>\>

Defined in: [scatterplot/callback-function.ts:113](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/echarts/src/scatterplot/callback-function.ts#L113)

The callback function for the scatterplot. When LLM calls the scatterplot function, it will be executed.
The result will be returned as a reponse of the function call to the LLM.

## Parameters

### \_\_namedParameters

`CallbackFunctionProps`

## Returns

`Promise`\<`CustomFunctionOutputProps`\<`ScatterplotOutputResult`, [`ScatterplotOutputData`](../type-aliases/ScatterplotOutputData.md)\>\>

The result of the function.
