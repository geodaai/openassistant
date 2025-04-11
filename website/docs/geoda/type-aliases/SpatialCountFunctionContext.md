# Type Alias: SpatialCountFunctionContext

> **SpatialCountFunctionContext**: `object`

Defined in: [packages/geoda/src/spatial-count/definition.ts:14](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/geoda/src/spatial-count/definition.ts#L14)

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
