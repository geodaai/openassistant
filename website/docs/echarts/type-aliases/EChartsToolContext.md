# Type Alias: EChartsToolContext

> **EChartsToolContext**: `object`

Defined in: [packages/echarts/src/types.ts:32](https://github.com/geodaopenjs/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/echarts/src/types.ts#L32)

The context you should provided to run the ECharts tool.

## Type declaration

### config?

> `optional` **config**: `object`

The config for the ECharts.

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

Whether the ECharts is draggable.

#### config.isExpanded?

> `optional` **isExpanded**: `boolean`

Whether the ECharts is expanded.

#### config.showLoess?

> `optional` **showLoess**: `boolean`

Whether to show the loess line. Only for scatter plot.

#### config.showRegressionLine?

> `optional` **showRegressionLine**: `boolean`

Whether to show the regression line. Only for scatter plot.

#### config.theme?

> `optional` **theme**: `string`

The theme of the ECharts.

### filteredIndex?

> `optional` **filteredIndex**: `number`[]

The filtered indices of the ECharts. This can be used to initialize what has been filtered in the ECharts.

### getValues

> **getValues**: [`GetValues`](GetValues.md)

The function to get the values of the variable from dataset.

### onSelected?

> `optional` **onSelected**: [`OnSelected`](OnSelected.md)

The function to handle the selected indices of the ECharts. This can be used to get what's highlighted in the ECharts and you can use it to sync the highlight in your own app.
