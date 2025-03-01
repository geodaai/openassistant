# Type Alias: CustomFunctions

> **CustomFunctions**: `object`

Defined in: [types.ts:162](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/core/src/types.ts#L162)

Type of Custom functions, a dictionary of functions e.g. createMap, createPlot etc.
key is the name of the function, value is the function itself.

The function should return a CustomFunctionOutputProps object, or a Promise of CustomFunctionOutputProps object if it is a async function.

## Index Signature

\[`key`: `string`\]: `object`
