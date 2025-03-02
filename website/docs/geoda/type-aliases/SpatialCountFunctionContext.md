# Type Alias: SpatialCountFunctionContext

> **SpatialCountFunctionContext**: `object`

Defined in: [packages/geoda/src/spatial-count/definition.ts:14](https://github.com/GeoDaCenter/openassistant/blob/aa41155e698e0b65b1716140c0c14440cdd9d76a/packages/geoda/src/spatial-count/definition.ts#L14)

The context for the spatial count function

## Type declaration

### getGeometries()

> **getGeometries**: (`datasetName`) => [`SpatialJoinGeometries`](SpatialJoinGeometries.md)

#### Parameters

##### datasetName

`string`

#### Returns

[`SpatialJoinGeometries`](SpatialJoinGeometries.md)

### getValues()

> **getValues**: (`datasetName`, `variableName`) => `number`[]

#### Parameters

##### datasetName

`string`

##### variableName

`string`

#### Returns

`number`[]

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
