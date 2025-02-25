# Type Alias: CustomFunctions

> **CustomFunctions**: `object`

Defined in: [types.ts:153](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/core/src/types.ts#L153)

Type of Custom functions, a dictionary of functions e.g. createMap, createPlot etc.
key is the name of the function, value is the function itself.

The function should return a CustomFunctionOutputProps object, or a Promise of CustomFunctionOutputProps object if it is a async function.

## Index Signature

\[`key`: `string`\]: `object`
