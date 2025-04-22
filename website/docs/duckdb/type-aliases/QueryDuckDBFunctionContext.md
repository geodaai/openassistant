# Type Alias: QueryDuckDBFunctionContext

> **QueryDuckDBFunctionContext**: `object`

Defined in: [packages/duckdb/src/query.tsx:88](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/duckdb/src/query.tsx#L88)

The context of the queryDuckDB function.

## Type declaration

### config

> **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

### duckDB?

> `optional` **duckDB**: `duckdb.AsyncDuckDB`

### getValues()

> **getValues**: (`datasetName`, `variableName`) => `unknown`[]

#### Parameters

##### datasetName

`string`

##### variableName

`string`

#### Returns

`unknown`[]

### onSelected?

> `optional` **onSelected**: `OnSelectedCallback`
