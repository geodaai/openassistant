# Type Alias: MoranScatterPlotFunctionContext

> **MoranScatterPlotFunctionContext**: `object`

Defined in: [packages/geoda/src/moran-scatterplot/tool.ts:75](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/geoda/src/moran-scatterplot/tool.ts#L75)

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

### getExistingWeights?

> `optional` **getExistingWeights**: [`GetExistingWeights`](GetExistingWeights.md)

Get the weights of the dataset.

### getValues

> **getValues**: [`GetValues`](GetValues.md)

Get the values of variable from the dataset.

### getWeights()?

> `optional` **getWeights**: (`weightsId`) => `object`

#### Parameters

##### weightsId

`string`

#### Returns

`object`

##### weights

> **weights**: `number`[][]

##### weightsMeta

> **weightsMeta**: `WeightsMeta`
