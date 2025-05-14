# Type Alias: QueryDuckDBFunctionContext

> **QueryDuckDBFunctionContext**: `object`

Defined in: [packages/duckdb/src/query.ts:81](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/duckdb/src/query.ts#L81)

The context of the queryDuckDB function.

## Type declaration

### config

> **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

### duckDB?

> `optional` **duckDB**: `duckdb.AsyncDuckDB`

### getValues()

> **getValues**: (`datasetName`, `variableName`) => `Promise`\<`unknown`[]\>

#### Parameters

##### datasetName

`string`

##### variableName

`string`

#### Returns

`Promise`\<`unknown`[]\>

### onSelected?

> `optional` **onSelected**: `OnSelectedCallback`
