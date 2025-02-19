# Type Alias: QueryDuckDBOutputData

> **QueryDuckDBOutputData**: `object`

Defined in: [queryTable.tsx:22](https://github.com/GeoDaCenter/openassistant/blob/fd29806c870b11792765637bc0dc6fbb46bd3016/packages/duckdb/src/queryTable.tsx#L22)

## Type declaration

### columnData

> **columnData**: `object`

#### Index Signature

\[`key`: `string`\]: `unknown`[]

### datasetName

> **datasetName**: `string`

### db

> **db**: `duckdb.AsyncDuckDB` \| `null`

### dbTableName

> **dbTableName**: `string`

### isDraggable?

> `optional` **isDraggable**: `boolean`

### onSelected()?

> `optional` **onSelected**: (`datasetName`, `columnName`, `selectedValues`) => `void`

#### Parameters

##### datasetName

`string`

##### columnName

`string`

##### selectedValues

`unknown`[]

#### Returns

`void`

### sql

> **sql**: `string`

### variableNames

> **variableNames**: `string`[]
