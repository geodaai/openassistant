# Type Alias: CallbackFunction()

> **CallbackFunction**: (`props`) => [`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\> \| `Promise`\<[`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\>\>

Defined in: [packages/core/src/types.ts:243](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/core/src/types.ts#L243)

Callback function for custom functions. You can define your own callback function to execute custom functions.

## Parameters

### props

[`CallbackFunctionProps`](CallbackFunctionProps.md)

The props of the callback function. See [CallbackFunctionProps](CallbackFunctionProps.md) for more details.

## Returns

[`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\> \| `Promise`\<[`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\>\>

The output of the custom function. See [CustomFunctionOutputProps](CustomFunctionOutputProps.md) for more details.
