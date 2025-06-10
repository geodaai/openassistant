# Type Alias: ExecuteGeocodingResult

> **ExecuteGeocodingResult**: `object`

Defined in: [packages/tools/osm/src/geocoding.ts:124](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/osm/src/geocoding.ts#L124)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.address

> **address**: `string`

#### additionalData.geojson

> **geojson**: `GeoJSON.FeatureCollection`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `GeoJSON.FeatureCollection`

#### llmResult.success

> **success**: `boolean`
