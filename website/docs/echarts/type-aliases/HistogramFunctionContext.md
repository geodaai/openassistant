# Type Alias: HistogramFunctionContext

> **HistogramFunctionContext**: `object`

Defined in: [histogram/definition.ts:37](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/echarts/src/histogram/definition.ts#L37)

The context of the histogram function.

## Type declaration

### config?

> `optional` **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.theme?

> `optional` **theme**: `string`

### getValues

> **getValues**: `GetValues`

### onSelected?

> `optional` **onSelected**: `OnSelectedCallback`

## Param

Get the values of a variable from the dataset. See GetValues for more details.

## Param

The callback function can be used to sync the selections of the histogram plot with the original dataset. See [OnSelectedCallback](OnSelectedCallback.md) for more details.

## Param

The configuration of the histogram plot.

## Param

The theme of the histogram plot. The possible values are 'light' and 'dark'.

## Param

Whether the histogram plot is draggable e.g. to a dashboard.
