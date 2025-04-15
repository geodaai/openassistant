# Type Alias: QueryDuckDBFunctionContext

> **QueryDuckDBFunctionContext**: `object`

Defined in: [packages/duckdb/src/query.tsx:88](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/duckdb/src/query.tsx#L88)

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
