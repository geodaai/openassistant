# Type Alias: RoutingLlmResult

> **RoutingLlmResult**: `object`

Defined in: [routing.ts:55](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/osm/src/routing.ts#L55)

## Type declaration

### error?

> `optional` **error**: `string`

### result?

> `optional` **result**: `object`

#### result.datasetName

> **datasetName**: `string`

#### result.destination

> **destination**: `GeoJSON.FeatureCollection`

#### result.distance

> **distance**: `number`

#### result.duration

> **duration**: `number`

#### result.geometry

> **geometry**: `GeoJSON.LineString`

#### result.origin

> **origin**: `GeoJSON.FeatureCollection`

#### result.steps?

> `optional` **steps**: `object`[]

### success

> **success**: `boolean`
