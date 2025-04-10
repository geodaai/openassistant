# Interface: LocalQueryParameters

Defined in: [packages/duckdb/src/types.ts:8](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/duckdb/src/types.ts#L8)

Parameters for the localQuery tool

## Properties

### datasetName

> **datasetName**: `string`

Defined in: [packages/duckdb/src/types.ts:10](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/duckdb/src/types.ts#L10)

The name of the original dataset

***

### dbTableName

> **dbTableName**: `string`

Defined in: [packages/duckdb/src/types.ts:16](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/duckdb/src/types.ts#L16)

The name of the table used in the sql string

***

### sql

> **sql**: `string`

Defined in: [packages/duckdb/src/types.ts:14](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/duckdb/src/types.ts#L14)

The SQL query to execute (following duckdb syntax)

***

### variableNames

> **variableNames**: `string`[]

Defined in: [packages/duckdb/src/types.ts:12](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/duckdb/src/types.ts#L12)

The names of the variables to include in the query
