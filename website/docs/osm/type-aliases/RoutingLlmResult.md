# Type Alias: RoutingLlmResult

> **RoutingLlmResult**: `object`

Defined in: [routing.ts:55](https://github.com/GeoDaCenter/openassistant/blob/36f516b8229288259590b2d9dab3b10cbfc3cbfd/packages/osm/src/routing.ts#L55)

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
