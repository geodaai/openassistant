# Interface: LocalQueryParameters

Defined in: packages/duckdb/src/types.ts:8

Parameters for the localQuery tool

## Properties

### datasetName

> **datasetName**: `string`

Defined in: packages/duckdb/src/types.ts:10

The name of the original dataset

***

### dbTableName

> **dbTableName**: `string`

Defined in: packages/duckdb/src/types.ts:16

The name of the table used in the sql string

***

### sql

> **sql**: `string`

Defined in: packages/duckdb/src/types.ts:14

The SQL query to execute (following duckdb syntax)

***

### variableNames

> **variableNames**: `string`[]

Defined in: packages/duckdb/src/types.ts:12

The names of the variables to include in the query
