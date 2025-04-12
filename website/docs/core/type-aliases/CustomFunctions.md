# Type Alias: CustomFunctions

> **CustomFunctions**: `object`

Defined in: [packages/core/src/types.ts:255](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/core/src/types.ts#L255)

Type of Custom functions, a dictionary of functions e.g. createMap, createPlot etc.
key is the name of the function, value is the function itself.

The function should return a CustomFunctionOutputProps object, or a Promise of CustomFunctionOutputProps object if it is a async function.

## Index Signature

\[`key`: `string`\]: `object`
