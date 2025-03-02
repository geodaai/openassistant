# Function: queryDuckDBCallbackFunction()

> **queryDuckDBCallbackFunction**(`props`): `Promise`\<`CustomFunctionOutputProps`\<`QueryDuckDBOutputResult`, [`QueryDuckDBOutputData`](../type-aliases/QueryDuckDBOutputData.md)\>\>

Defined in: [query.tsx:213](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/duckdb/src/query.tsx#L213)

The callback function for the queryDuckDB function. When LLM calls the queryDuckDB function, it will be executed.
The result will be returned as a response of the function call to the LLM.

## Parameters

### props

`CallbackFunctionProps`

The callback function properties

## Returns

`Promise`\<`CustomFunctionOutputProps`\<`QueryDuckDBOutputResult`, [`QueryDuckDBOutputData`](../type-aliases/QueryDuckDBOutputData.md)\>\>

The result of the function
