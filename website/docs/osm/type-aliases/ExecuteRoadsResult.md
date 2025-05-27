# Type Alias: ExecuteRoadsResult

> **ExecuteRoadsResult**: `object`

Defined in: [packages/tools/osm/src/roads.ts:251](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/osm/src/roads.ts#L251)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.boundary

> **boundary**: `string`

#### additionalData.geojson

> **geojson**: `GeoJSON.FeatureCollection`

#### additionalData.roadType

> **roadType**: `string`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `GeoJSON.FeatureCollection`

#### llmResult.success

> **success**: `boolean`
