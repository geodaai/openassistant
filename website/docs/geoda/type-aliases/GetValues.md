# Type Alias: GetValues()

> **GetValues**: (`datasetName`, `variableName`) => `Promise`\<`number`[]\>

Defined in: [packages/geoda/src/moran-scatterplot/definition.ts:25](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/geoda/src/moran-scatterplot/definition.ts#L25)

Function signature for retrieving variable values from a dataset.

:::note
Users should implement this function to retrieve the values of a variable from their own dataset e.g. database.
:::

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
