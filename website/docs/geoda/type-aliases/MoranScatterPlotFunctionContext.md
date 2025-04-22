# Type Alias: MoranScatterPlotFunctionContext

> **MoranScatterPlotFunctionContext**: `object`

Defined in: [packages/geoda/src/moran-scatterplot/tool.ts:77](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/moran-scatterplot/tool.ts#L77)

The context of the scatterplot function. The context will be used by the function calling to create the scatterplot.

## Type declaration

### config?

> `optional` **config**: `object`

The configuration of the scatterplot.

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.isExpanded?

> `optional` **isExpanded**: `boolean`

#### config.theme?

> `optional` **theme**: `string`

### getValues

> **getValues**: [`GetValues`](GetValues.md)

Get the values of variable from the dataset.
