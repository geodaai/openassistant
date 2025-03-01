# Type Alias: RegisterFunctionCallingProps

> **RegisterFunctionCallingProps**: `object`

Defined in: [types.ts:287](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L287)

Type of RegisterFunctionCallingProps

## Type declaration

### callbackFunction?

> `optional` **callbackFunction**: [`CallbackFunction`](CallbackFunction.md)

### callbackFunctionContext?

> `optional` **callbackFunctionContext**: [`CustomFunctionContext`](CustomFunctionContext.md)\<`any`\>

### callbackMessage?

> `optional` **callbackMessage**: [`CustomMessageCallback`](CustomMessageCallback.md)

### description

> **description**: `string`

### name

> **name**: `string`

### properties

> **properties**: `object`

#### Index Signature

\[`key`: `string`\]: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `type`: `string`; \} \| `JsonSchema7Type`

### required

> **required**: `string`[]

## Param

The name of the function.

## Param

The description of the function.

## Param

The properties of the function.

## Param

The required properties of the function.

## Param

The callback function of the function.

## Param

The context of the callback function.

## Param

The message of the callback function.
