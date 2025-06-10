# Type Alias: LocalQueryResult

> **LocalQueryResult**: `object`

Defined in: [packages/tools/duckdb/src/types.ts:39](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/duckdb/src/types.ts#L39)

Combined result type for localQuery

## Type declaration

### additionalData?

> `optional` **additionalData**: [`LocalQueryAdditionalData`](LocalQueryAdditionalData.md)

### llmResult

> **llmResult**: `object`

#### llmResult.data?

> `optional` **data**: `object`

#### llmResult.data.firstTwoRows

> **firstTwoRows**: `Record`\<`string`, `unknown`\>[]

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.instruction?

> `optional` **instruction**: `string`

#### llmResult.success

> **success**: `boolean`
