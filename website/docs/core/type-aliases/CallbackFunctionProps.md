# Type Alias: CallbackFunctionProps

> **CallbackFunctionProps**: `object`

Defined in: [packages/core/src/types.ts:226](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/core/src/types.ts#L226)

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
