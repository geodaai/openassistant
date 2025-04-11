# Type Alias: ScatterplotOutputData

> **ScatterplotOutputData**: `object`

Defined in: [packages/echarts/src/scatterplot/callback-function.ts:62](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/echarts/src/scatterplot/callback-function.ts#L62)

The data of the scatterplot function.

## Type declaration

### datasetName

> **datasetName**: `string`

### filteredIndex?

> `optional` **filteredIndex**: `number`[]

### id?

> `optional` **id**: `string`

### isDraggable?

> `optional` **isDraggable**: `boolean`

### isExpanded?

> `optional` **isExpanded**: `boolean`

### onSelected()?

> `optional` **onSelected**: (`datasetName`, `selectedIndices`) => `void`

#### Parameters

##### datasetName

`string`

##### selectedIndices

`number`[]

#### Returns

`void`

### regressionResults

> **regressionResults**: [`ComputeRegressionResult`](ComputeRegressionResult.md)

### setIsExpanded()?

> `optional` **setIsExpanded**: (`isExpanded`) => `void`

#### Parameters

##### isExpanded

`boolean`

#### Returns

`void`

### showLoess?

> `optional` **showLoess**: `boolean`

### showRegressionLine?

> `optional` **showRegressionLine**: `boolean`

### theme?

> `optional` **theme**: `string`

### xData

> **xData**: `number`[]

### xVariableName

> **xVariableName**: `string`

### yData

> **yData**: `number`[]

### yVariableName

> **yVariableName**: `string`

## Param

The id of the scatterplot.

## Param

The name of the dataset.

## Param

The name of the x variable.

## Param

The name of the y variable.

## Param

The x data.

## Param

The y data.

## Param

The regression results.

## Param

The indices of the selected points.

## Param

The callback function can be used to sync the selections of the scatterplot with the original dataset.

## Param

The theme of the scatterplot.

## Param

Whether to show the loess regression.

## Param

Whether to show the regression line.
