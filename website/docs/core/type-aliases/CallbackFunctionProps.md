# Type Alias: CallbackFunctionProps

> **CallbackFunctionProps**: `object`

Defined in: [types.ts:138](https://github.com/GeoDaCenter/openassistant/blob/aa41155e698e0b65b1716140c0c14440cdd9d76a/packages/core/src/types.ts#L138)

Props of the callback function.

## Type declaration

### functionArgs

> **functionArgs**: `Record`\<`string`, `unknown`\>

### functionContext?

> `optional` **functionContext**: [`CustomFunctionContext`](CustomFunctionContext.md)\<`unknown`\> \| [`CustomFunctionContextCallback`](CustomFunctionContextCallback.md)\<`unknown`\>

### functionName

> **functionName**: `string`

### previousOutput?

> `optional` **previousOutput**: [`CustomFunctionOutputProps`](CustomFunctionOutputProps.md)\<`unknown`, `unknown`\>[]

## Param

The name of the function.

## Param

The arguments of the function.

## Param

The context of the function. See [CustomFunctionContext](CustomFunctionContext.md) for more details.

## Param

The output of the previous function.
