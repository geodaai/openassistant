# Variable: histogram

> `const` **histogram**: `ExtendedTool`\<`ZodObject`\<\{ `datasetName`: `ZodString`; `numberOfBins`: `ZodOptional`\<`ZodNumber`\>; `variableName`: `ZodString`; \}, `UnknownKeysParam`, `ZodTypeAny`, \{ `datasetName`: `string`; `numberOfBins`: `number`; `variableName`: `string`; \}, \{ `datasetName`: `string`; `numberOfBins`: `number`; `variableName`: `string`; \}\>, \{ `error`: `string`; `instruction`: `string`; `result`: \{ `datasetName`: `string`; `details`: `string`; `id`: `string`; `variableName`: `string`; \}; `success`: `boolean`; \}, `undefined` \| \{ `barDataIndexes`: `number`[][]; `datasetName`: `string`; `histogramData`: `object`[]; `id`: `string`; `isDraggable`: `boolean`; `isExpanded`: `boolean`; `theme`: `string`; `variableName`: `string`; \}, [`HistogramToolContext`](../type-aliases/HistogramToolContext.md)\>

Defined in: [packages/echarts/src/histogram/tool.ts:10](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/echarts/src/histogram/tool.ts#L10)

The histogram tool.
