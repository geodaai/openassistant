# Type Alias: ExecuteSpatialWeightsResult

> **ExecuteSpatialWeightsResult**: `object`

Defined in: [packages/geoda/src/weights/tool.ts:88](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/weights/tool.ts#L88)

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

#### llmResult.result.weightsId

> **weightsId**: `string`

#### llmResult.result.weightsMeta

> **weightsMeta**: `WeightsMeta`

#### llmResult.success

> **success**: `boolean`
