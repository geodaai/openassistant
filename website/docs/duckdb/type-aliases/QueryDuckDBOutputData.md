# Type Alias: QueryDuckDBOutputData

> **QueryDuckDBOutputData**: `object`

Defined in: [queryTable.tsx:22](https://github.com/GeoDaCenter/openassistant/blob/aa41155e698e0b65b1716140c0c14440cdd9d76a/packages/duckdb/src/queryTable.tsx#L22)

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
