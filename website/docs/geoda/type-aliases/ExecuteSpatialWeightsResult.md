# Type Alias: ExecuteSpatialWeightsResult

> **ExecuteSpatialWeightsResult**: `object`

Defined in: [packages/tools/geoda/src/weights/tool.ts:148](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/geoda/src/weights/tool.ts#L148)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### Index Signature

\[`id`: `string`\]: `unknown`

#### additionalData.weightsId

> **weightsId**: `string`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `string`

#### llmResult.success

> **success**: `boolean`

#### llmResult.weightsId?

> `optional` **weightsId**: `string`

#### llmResult.weightsMeta?

> `optional` **weightsMeta**: `WeightsMeta`
