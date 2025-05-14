# Type Alias: ExecuteGeocodingResult

> **ExecuteGeocodingResult**: `object`

Defined in: [packages/osm/src/geocoding.ts:117](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/osm/src/geocoding.ts#L117)

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
