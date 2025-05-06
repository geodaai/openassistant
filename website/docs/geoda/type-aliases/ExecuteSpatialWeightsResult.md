# Type Alias: ExecuteSpatialWeightsResult

> **ExecuteSpatialWeightsResult**: `object`

Defined in: [packages/geoda/src/weights/tool.ts:148](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/geoda/src/weights/tool.ts#L148)

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

#### llmResult.result.mapBounds?

> `optional` **mapBounds**: `number`[]

#### llmResult.result.weightsId

> **weightsId**: `string`

#### llmResult.result.weightsMeta

> **weightsMeta**: `WeightsMeta`

#### llmResult.success

> **success**: `boolean`
