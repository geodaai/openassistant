# Function: registerTools()

> **registerTools**(): `object`

Defined in: [packages/duckdb/src/register-tools.ts:10](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/duckdb/src/register-tools.ts#L10)

## Returns

`object`

### localQuery

> **localQuery**: `ExtendedTool`\<`ZodObject`\<\{ `datasetName`: `ZodString`; `dbTableName`: `ZodString`; `sql`: `ZodString`; `variableNames`: `ZodArray`\<`ZodString`, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `datasetName`: `string`; `dbTableName`: `string`; `sql`: `string`; `variableNames`: `string`[]; \}, \{ `datasetName`: `string`; `dbTableName`: `string`; `sql`: `string`; `variableNames`: `string`[]; \}\>, \{ `data`: \{ `firstTwoRows`: `object`[]; \}; `dbTableName`: `any`; `error`: `undefined`; `instruction`: `undefined`; `success`: `boolean`; \}, \{ `config`: \{ `isDraggable`: `boolean`; \}; `datasetName`: `any`; `dbTableName`: `any`; `sql`: `any`; `title`: `string`; `variableNames`: `any`; \}, \{ `config`: \{ `isDraggable`: `boolean`; \}; `duckDB`: `null`; `getValues`: () => `never`; `onSelected`: () => `never`; \}\>
