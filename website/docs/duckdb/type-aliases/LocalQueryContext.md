# Type Alias: LocalQueryContext

> **LocalQueryContext**: `object`

Defined in: [packages/tools/duckdb/src/types.ts:21](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/duckdb/src/types.ts#L21)

Context object for the localQuery tool

## Type declaration

### getDuckDB()?

> `optional` **getDuckDB**: () => `Promise`\<`AsyncDuckDB` \| `null`\>

Optional DuckDB instance for querying

#### Returns

`Promise`\<`AsyncDuckDB` \| `null`\>

### getValues()

> **getValues**: (`datasetName`, `variableName`) => `Promise`\<`unknown`[]\>

Function to get values from a dataset

#### Parameters

##### datasetName

`string`

The name of the dataset

##### variableName

`string`

The name of the variable to get values for

#### Returns

`Promise`\<`unknown`[]\>

An array of values for the specified variable
