# Type Alias: SpatialCountFunctionContext

> **SpatialCountFunctionContext**: `object`

Defined in: [packages/geoda/src/spatial-count/tool.ts:70](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/geoda/src/spatial-count/tool.ts#L70)

The context for the spatial count function

## Type declaration

### getGeometries()

> **getGeometries**: (`datasetName`) => [`SpatialJoinGeometries`](SpatialJoinGeometries.md)

#### Parameters

##### datasetName

`string`

#### Returns

[`SpatialJoinGeometries`](SpatialJoinGeometries.md)

### getValues

> **getValues**: [`GetValues`](GetValues.md)

### saveAsDataset()?

> `optional` **saveAsDataset**: (`datasetName`, `data`) => `void`

#### Parameters

##### datasetName

`string`

##### data

`Record`\<`string`, `number`[]\>

#### Returns

`void`

## Param

the function to get the geometries from the dataset: (datasetName: string) => SpatialJoinGeometries

## Returns

the geometries from the dataset
