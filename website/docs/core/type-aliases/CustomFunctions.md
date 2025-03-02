# Type Alias: CustomFunctions

> **CustomFunctions**: `object`

Defined in: [types.ts:165](https://github.com/GeoDaCenter/openassistant/blob/a5eebdb32e6bf1b6b4eedf634485568edcefaa57/packages/core/src/types.ts#L165)

Type of Custom functions, a dictionary of functions e.g. createMap, createPlot etc.
key is the name of the function, value is the function itself.

The function should return a CustomFunctionOutputProps object, or a Promise of CustomFunctionOutputProps object if it is a async function.

## Index Signature

\[`key`: `string`\]: `object`
