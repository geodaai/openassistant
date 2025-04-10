# Type Alias: ScatterplotFunctionContext

> **ScatterplotFunctionContext**: `object`

Defined in: [packages/echarts/src/scatterplot/definition.ts:43](https://github.com/GeoDaCenter/openassistant/blob/522ecb744b2b3ea1ecebec02c21c19736abe51ae/packages/echarts/src/scatterplot/definition.ts#L43)

The context of the scatterplot function. The context will be used by the function calling to create the scatterplot.

## Type declaration

### config?

> `optional` **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.theme?

> `optional` **theme**: `string`

### filteredIndex?

> `optional` **filteredIndex**: `number`[]

### getValues

> **getValues**: `GetValues`

### onSelected

> **onSelected**: `OnSelectedCallback`

## Param

Get the values of two variables from the dataset. See [GetValues](GetValues.md) for more details.

## Param

The callback function can be used to sync the selections of the scatterplot with the original dataset. See [OnSelectedCallback](OnSelectedCallback.md) for more details.

## Param

The indices of the selected points.

## Param

The configuration of the scatterplot.

## Param

The flag to indicate if the scatterplot is draggable.

## Param

The theme of the scatterplot. The possible values are 'light' and 'dark'.
