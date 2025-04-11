# Variable: histogram

> `const` **histogram**: `ExtendedTool`\<`ZodObject`\<\{ `datasetName`: `ZodString`; `numberOfBins`: `ZodOptional`\<`ZodNumber`\>; `variableName`: `ZodString`; \}, `UnknownKeysParam`, `ZodTypeAny`, \{ `datasetName`: `string`; `numberOfBins`: `number`; `variableName`: `string`; \}, \{ `datasetName`: `string`; `numberOfBins`: `number`; `variableName`: `string`; \}\>, \{ `error`: `string`; `instruction`: `string`; `result`: \{ `datasetName`: `string`; `details`: `string`; `id`: `string`; `variableName`: `string`; \}; `success`: `boolean`; \}, `undefined` \| \{ `barDataIndexes`: `number`[][]; `datasetName`: `string`; `histogramData`: `object`[]; `id`: `string`; `isDraggable`: `boolean`; `isExpanded`: `boolean`; `theme`: `string`; `variableName`: `string`; \}, [`HistogramToolContext`](../type-aliases/HistogramToolContext.md)\>

Defined in: [packages/echarts/src/histogram/tool.ts:10](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/echarts/src/histogram/tool.ts#L10)

The histogram tool.
