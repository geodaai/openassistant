# Function: queryDuckDBCallbackFunction()

> **queryDuckDBCallbackFunction**(`__namedParameters`): `Promise`\<`CustomFunctionOutputProps`\<`QueryDuckDBOutputResult`, [`QueryDuckDBOutputData`](../type-aliases/QueryDuckDBOutputData.md)\>\>

Defined in: [query.tsx:212](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/duckdb/src/query.tsx#L212)

The callback function for the queryDuckDB function. When LLM calls the queryDuckDB function, it will be executed.
The result will be returned as a reponse of the function call to the LLM.

## Parameters

### \_\_namedParameters

`CallbackFunctionProps`

## Returns

`Promise`\<`CustomFunctionOutputProps`\<`QueryDuckDBOutputResult`, [`QueryDuckDBOutputData`](../type-aliases/QueryDuckDBOutputData.md)\>\>

The result of the function.
