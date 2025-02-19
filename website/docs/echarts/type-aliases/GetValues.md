# Type Alias: GetValues()

> **GetValues**: (`datasetName`, `variableName`) => `Promise`\<`number`[]\>

Defined in: [histogram/definition.ts:17](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/echarts/src/histogram/definition.ts#L17)

Function signature for retrieving variable values from a dataset.

## Parameters

### datasetName

`string`

Name of the target dataset

### variableName

`string`

Name of the variable to retrieve

## Returns

`Promise`\<`number`[]\>

Promise containing an array of numeric values

## Note

Users should implement this function to retrieve the values of a variable from their own dataset e.g. database.
