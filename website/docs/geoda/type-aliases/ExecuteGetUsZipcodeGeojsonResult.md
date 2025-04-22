# Type Alias: ExecuteGetUsZipcodeGeojsonResult

> **ExecuteGetUsZipcodeGeojsonResult**: `object`

Defined in: [packages/geoda/src/us\_zipcodes/tool.ts:53](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/us_zipcodes/tool.ts#L53)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.geojson

> **geojson**: `GeoJSON.FeatureCollection`

#### additionalData.zipcode

> **zipcode**: `string`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `object`

#### llmResult.result.zipcode

> **zipcode**: `string`

#### llmResult.success

> **success**: `boolean`
