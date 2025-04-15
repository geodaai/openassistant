# Variable: boxplot

> `const` **boxplot**: `ExtendedTool`\<`ZodObject`\<\{ `boundIQR`: `ZodOptional`\<`ZodNumber`\>; `datasetName`: `ZodString`; `variableNames`: `ZodArray`\<`ZodString`\>; \}, `UnknownKeysParam`, `ZodTypeAny`, \{ `boundIQR`: `number`; `datasetName`: `string`; `variableNames`: `string`[]; \}, \{ `boundIQR`: `number`; `datasetName`: `string`; `variableNames`: `string`[]; \}\>, \{ `error`: `string`; `instruction`: `string`; `result`: \{ `boundIQR`: `number`; `boxplotData`: [`BoxplotDataProps`](../type-aliases/BoxplotDataProps.md); `datasetName`: `string`; `id`: `string`; \}; `success`: `boolean`; \}, `undefined` \| \{ `boundIQR`: `number`; `boxplotData`: [`BoxplotDataProps`](../type-aliases/BoxplotDataProps.md); `data`: `Record`\<`string`, `number`[]\>; `datasetName`: `string`; `id`: `string`; `isDraggable`: `boolean`; `isExpanded`: `boolean`; `theme`: `string`; `variables`: `string`[]; \}, [`BoxplotFunctionContext`](../type-aliases/BoxplotFunctionContext.md)\>

Defined in: [packages/echarts/src/boxplot/tool.ts:42](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/echarts/src/boxplot/tool.ts#L42)

The boxplot tool is used to create a boxplot chart.

## Example

```typescript
import { boxplot } from '@openassistant/echarts';

const boxplotTool = {
  ...boxplot,
  context: {
    ...boxplot.context,
    getValues: (datasetName: string, variableName: string) => {
      // get the values of the variable from your dataset, e.g.
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
}
```

### getValues()

See [BoxplotFunctionContext](../type-aliases/BoxplotFunctionContext.md) for detailed usage.

User implements this function to get the values of the variable from dataset.

For prompts like "_can you show a box plot of the revenue per capita for each location in dataset myVenues_", the tool will
call the `getValues()` function twice:
- get the values of **revenue** from dataset: getValues('myVenues', 'revenue')
- get the values of **population** from dataset: getValues('myVenues', 'population')

A duckdb table will be created using the values returned from `getValues()`, and LLM will generate a sql query to query the table to answer the user's prompt.
