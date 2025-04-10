# Type Alias: RegisterFunctionCallingProps

> **RegisterFunctionCallingProps**: `object`

Defined in: [packages/core/src/types.ts:471](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/core/src/types.ts#L471)

Type of RegisterFunctionCallingProps

## Type declaration

### callbackFunction

> **callbackFunction**: [`CallbackFunction`](CallbackFunction.md)

### callbackFunctionContext?

> `optional` **callbackFunctionContext**: [`CustomFunctionContext`](CustomFunctionContext.md)\<`any`\>

### ~~callbackMessage?~~

> `optional` **callbackMessage**: [`CustomMessageCallback`](CustomMessageCallback.md)

#### Deprecated

Callback function to create custom UI elements like plots or maps

### component?

> `optional` **component**: `React.ComponentType`

Component for the tool call

### description

> **description**: `string`

### name

> **name**: `string`

### properties

> **properties**: `object`

#### Index Signature

\[`key`: `string`\]: `object`

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
