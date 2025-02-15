# Type Alias: GetValues()

> **GetValues**: (`datasetName`, `variableName`) => `Promise`\<`number`[]\>

Defined in: [histogram/definition.ts:17](https://github.com/GeoDaCenter/openassistant/blob/2c73424721a2d454352fbebfbd647d2c7c73df8b/packages/echarts/src/histogram/definition.ts#L17)

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
