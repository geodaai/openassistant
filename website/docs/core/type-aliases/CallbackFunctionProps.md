# Type Alias: CallbackFunctionProps

> **CallbackFunctionProps**: `object`

Defined in: [packages/core/src/types.ts:228](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/core/src/types.ts#L228)

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
