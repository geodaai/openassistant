# Type Alias: ExecuteSpatialWeightsResult

> **ExecuteSpatialWeightsResult**: `object`

Defined in: [packages/geoda/src/weights/tool.ts:96](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/geoda/src/weights/tool.ts#L96)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.datasetName

> **datasetName**: `string`

#### additionalData.weights

> **weights**: `number`[][]

#### additionalData.weightsMeta

> **weightsMeta**: `WeightsMeta`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `object`

#### llmResult.result.datasetName

> **datasetName**: `string`

#### llmResult.result.details?

> `optional` **details**: `string`

#### llmResult.result.weightsMeta

> **weightsMeta**: `WeightsMeta`

#### llmResult.success

> **success**: `boolean`
