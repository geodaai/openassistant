# Interface: LocalQueryAdditionalData

Defined in: packages/duckdb/src/types.ts:85

Additional data returned with the query result

## Properties

### columnData

> **columnData**: `Record`\<`string`, `unknown`[]\>

Defined in: packages/duckdb/src/types.ts:88

***

### datasetName

> **datasetName**: `string`

Defined in: packages/duckdb/src/types.ts:90

***

### dbTableName

> **dbTableName**: `string`

Defined in: packages/duckdb/src/types.ts:91

***

### onSelected()?

> `optional` **onSelected**: (`datasetName`, `columnName`, `selectedValues`) => `void`

Defined in: packages/duckdb/src/types.ts:92

#### Parameters

##### datasetName

`string`

##### columnName

`string`

##### selectedValues

`unknown`[]

#### Returns

`void`

***

### sql

> **sql**: `string`

Defined in: packages/duckdb/src/types.ts:87

***

### title

> **title**: `string`

Defined in: packages/duckdb/src/types.ts:86

***

### variableNames

> **variableNames**: `string`[]

Defined in: packages/duckdb/src/types.ts:89
