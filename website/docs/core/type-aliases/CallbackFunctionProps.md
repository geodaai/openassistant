# Type Alias: CallbackFunctionProps

> **CallbackFunctionProps**: `object`

Defined in: [types.ts:129](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/core/src/types.ts#L129)

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
