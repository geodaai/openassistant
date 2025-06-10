# Type Alias: MergeTablesArgs

> **MergeTablesArgs**: `z.ZodObject`\<\{ `columnNamesA`: `z.ZodArray`\<`z.ZodString`\>; `columnNamesB`: `z.ZodArray`\<`z.ZodString`\>; `datasetNameA`: `z.ZodString`; `datasetNameB`: `z.ZodString`; `dbTableNameA`: `z.ZodString`; `dbTableNameB`: `z.ZodString`; `keyColumn`: `z.ZodOptional`\<`z.ZodString`\>; `mergeType`: `z.ZodEnum`\<\[`"horizontal"`, `"vertical"`\]\>; `sql`: `z.ZodString`; \}\>

Defined in: [packages/tools/duckdb/src/merge.ts:197](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/duckdb/src/merge.ts#L197)
