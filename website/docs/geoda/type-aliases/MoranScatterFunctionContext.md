# Type Alias: MoranScatterFunctionContext

> **MoranScatterFunctionContext**: `object`

Defined in: [packages/geoda/src/moran-scatterplot/definition.ts:38](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/geoda/src/moran-scatterplot/definition.ts#L38)

The context of the scatterplot function. The context will be used by the function calling to create the scatterplot.

## Type declaration

### config?

> `optional` **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.theme?

> `optional` **theme**: `string`

### getValues

> **getValues**: [`GetValues`](GetValues.md)

### getWeights

> **getWeights**: [`GetWeights`](GetWeights.md)

## Param

Get the values of two variables from the dataset. See [GetValues](GetValues.md) for more details.

## Param

The configuration of the scatterplot.

## Param

The flag to indicate if the scatterplot is draggable.

## Param

The theme of the scatterplot. The possible values are 'light' and 'dark'.
