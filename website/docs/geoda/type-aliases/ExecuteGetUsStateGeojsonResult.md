# Type Alias: ExecuteGetUsStateGeojsonResult

> **ExecuteGetUsStateGeojsonResult**: `object`

Defined in: [packages/geoda/src/us\_states/tool.ts:54](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/us_states/tool.ts#L54)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.geojson

> **geojson**: `GeoJSON.FeatureCollection`

#### additionalData.state

> **state**: `string`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `object`

#### llmResult.result.state

> **state**: `string`

#### llmResult.success

> **success**: `boolean`
