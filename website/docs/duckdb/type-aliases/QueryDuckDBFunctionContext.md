# Type Alias: QueryDuckDBFunctionContext

> **QueryDuckDBFunctionContext**: `object`

Defined in: [packages/duckdb/src/query.tsx:77](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/duckdb/src/query.tsx#L77)

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
