# Variable: localQuery

> `const` **localQuery**: `ExtendedTool`\<`ZodObject`\<\{ `datasetName`: `ZodString`; `dbTableName`: `ZodString`; `sql`: `ZodString`; `variableNames`: `ZodArray`\<`ZodString`, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `datasetName`: `string`; `dbTableName`: `string`; `sql`: `string`; `variableNames`: `string`[]; \}, \{ `datasetName`: `string`; `dbTableName`: `string`; `sql`: `string`; `variableNames`: `string`[]; \}\>\>

Defined in: [packages/duckdb/src/tool.ts:125](https://github.com/GeoDaCenter/openassistant/blob/a1bcfdf89aac2d64b3bda9cf92b96ead076def28/packages/duckdb/src/tool.ts#L125)

The localQuery tool is used to execute a query against a local dataset.

## Example

```typescript
import { localQuery } from '@openassistant/duckdb';

const localQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: (datasetName: string, variableName: string) => {
      // get the values of the variable from your dataset, e.g.
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
}
```

- getValues()

User implements this function to get the values of the variable from dataset.
See

## See

 - For prompts like "Show me the revenue per capita for each location in dataset myVenues", the tool will
call the `getValues()` function twice:
- first time to get the values of revenue from dataset: getValues('myVenues', 'revenue')
- second time to get the values of population from dataset: getValues('myVenues', 'population')

A duckdb table will be created using the values returned from `getValues()`, and LLM will generate a sql query to query the table to answer the user's prompt.

- onSelected()

User implements this function to sync the selections of the query result table with the original dataset.
See
 -
