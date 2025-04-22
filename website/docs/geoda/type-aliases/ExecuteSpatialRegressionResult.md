# Type Alias: ExecuteSpatialRegressionResult

> **ExecuteSpatialRegressionResult**: `object`

Defined in: [packages/geoda/src/regression/tool.ts:54](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/regression/tool.ts#L54)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.datasetName

> **datasetName**: `string`

#### additionalData.report

> **report**: `LinearRegressionResult` \| `SpatialLagResult` \| `SpatialErrorResult` \| `null`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `string`

#### llmResult.success

> **success**: `boolean`
