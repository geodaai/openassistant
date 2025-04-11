# Function: ScatterplotCallbackFunction()

> **ScatterplotCallbackFunction**(`props`): `Promise`\<`CustomFunctionOutputProps`\<`ScatterplotOutputResult`, [`ScatterplotOutputData`](../type-aliases/ScatterplotOutputData.md)\>\>

Defined in: [packages/echarts/src/scatterplot/callback-function.ts:114](https://github.com/GeoDaCenter/openassistant/blob/7dec66552ed2da789768e26aca21ecb2918b5d3b/packages/echarts/src/scatterplot/callback-function.ts#L114)

The callback function for the scatterplot. When LLM calls the scatterplot function, it will be executed.
The result will be returned as a reponse of the function call to the LLM.

## Parameters

### props

`CallbackFunctionProps`

The callback function properties

## Returns

`Promise`\<`CustomFunctionOutputProps`\<`ScatterplotOutputResult`, [`ScatterplotOutputData`](../type-aliases/ScatterplotOutputData.md)\>\>

The result of the function.
