# Type Alias: QueryDuckDBFunctionContext

> **QueryDuckDBFunctionContext**: `object`

Defined in: [packages/tools/duckdb/src/query.ts:81](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/duckdb/src/query.ts#L81)

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
