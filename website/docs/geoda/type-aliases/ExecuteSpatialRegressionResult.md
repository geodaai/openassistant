# Type Alias: ExecuteSpatialRegressionResult

> **ExecuteSpatialRegressionResult**: `object`

Defined in: [packages/geoda/src/regression/tool.ts:47](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/geoda/src/regression/tool.ts#L47)

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
