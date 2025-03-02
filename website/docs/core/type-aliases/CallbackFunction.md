# Type Alias: CallbackFunction()

> **CallbackFunction**: (`props`) => [`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\> \| `Promise`\<[`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\>\>

Defined in: [types.ts:153](https://github.com/GeoDaCenter/openassistant/blob/a5eebdb32e6bf1b6b4eedf634485568edcefaa57/packages/core/src/types.ts#L153)

Callback function for custom functions. You can define your own callback function to execute custom functions.

## Parameters

### props

[`CallbackFunctionProps`](CallbackFunctionProps.md)

The props of the callback function. See [CallbackFunctionProps](CallbackFunctionProps.md) for more details.

## Returns

[`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\> \| `Promise`\<[`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\>\>

The output of the custom function. See [CustomFunctionOutputProps](CustomFunctionOutputProps.md) for more details.
