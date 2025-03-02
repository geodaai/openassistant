# Function: queryDuckDBFunctionDefinition()

> **queryDuckDBFunctionDefinition**(`context`): `RegisterFunctionCallingProps`

Defined in: [query.tsx:112](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/duckdb/src/query.tsx#L112)

Define the function to query the duckdb database. You can pass getValues() to the context for creating a new table in the duckdb database.
If you pass a duckDB instance to the context, the function will use the existing duckDB instance to create a new table.
The SQL query will be executed in the duckDB instance, and the result will be displayed in a table.
Users can select rows in the table, and the selections can be synced back to the original dataset using the onSelected callback.
For sync the selections, user can select a key variable in the dataset which also present in the query result table.

## Parameters

### context

`CustomFunctionContext`\<`QueryDuckDBFunctionContextValues`\>

The context of the function. See QueryDuckDBFunctionContext for more details.

## Returns

`RegisterFunctionCallingProps`

The function definition.
