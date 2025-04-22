# Type Alias: ExecuteGetUsCountyGeojsonResult

> **ExecuteGetUsCountyGeojsonResult**: `object`

Defined in: [packages/geoda/src/us\_county/tool.ts:54](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/us_county/tool.ts#L54)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.fips

> **fips**: `string`

#### additionalData.geojson

> **geojson**: `GeoJSON.FeatureCollection`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `object`

#### llmResult.result.fips

> **fips**: `string`

#### llmResult.success

> **success**: `boolean`
