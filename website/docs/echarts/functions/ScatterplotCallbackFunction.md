# Function: ScatterplotCallbackFunction()

> **ScatterplotCallbackFunction**(`__namedParameters`): `Promise`\<`CustomFunctionOutputProps`\<`ScatterplotOutputResult`, [`ScatterplotOutputData`](../type-aliases/ScatterplotOutputData.md)\>\>

Defined in: [scatterplot/callback-function.ts:111](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/echarts/src/scatterplot/callback-function.ts#L111)

The callback function for the scatterplot. When LLM calls the scatterplot function, it will be executed.
The result will be returned as a reponse of the function call to the LLM.

## Parameters

### \_\_namedParameters

`CallbackFunctionProps`

## Returns

`Promise`\<`CustomFunctionOutputProps`\<`ScatterplotOutputResult`, [`ScatterplotOutputData`](../type-aliases/ScatterplotOutputData.md)\>\>

The result of the function.
