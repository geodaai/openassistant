# Type Alias: CallbackFunction()

> **CallbackFunction**: (`props`) => [`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\> \| `Promise`\<[`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\>\>

Defined in: [types.ts:145](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/types.ts#L145)

Callback function for custom functions. You can define your own callback function to execute custom functions.

## Parameters

### props

[`CallbackFunctionProps`](CallbackFunctionProps.md)

The props of the callback function. See [CallbackFunctionProps](CallbackFunctionProps.md) for more details.

## Returns

[`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\> \| `Promise`\<[`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\>\>

The output of the custom function. See [CustomFunctionOutputProps](CustomFunctionOutputProps.md) for more details.
