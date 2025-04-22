# Type Alias: ExecuteSpatialJoinResult

> **ExecuteSpatialJoinResult**: `object`

Defined in: [packages/geoda/src/spatial-count/tool.ts:78](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/spatial-count/tool.ts#L78)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.firstDatasetName

> **firstDatasetName**: `string`

#### additionalData.joinOperators?

> `optional` **joinOperators**: `string`[]

#### additionalData.joinResult

> **joinResult**: `number`[][]

#### additionalData.joinValues

> **joinValues**: `Record`\<`string`, `number`[]\>

#### additionalData.joinVariableNames?

> `optional` **joinVariableNames**: `string`[]

#### additionalData.secondDataset?

> `optional` **secondDataset**: `string`[]

#### additionalData.secondDatasetName?

> `optional` **secondDatasetName**: `string`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `object`

#### llmResult.result.details

> **details**: `string`

#### llmResult.result.firstDatasetName

> **firstDatasetName**: `string`

#### llmResult.result.firstTenRows?

> `optional` **firstTenRows**: `number`[][]

#### llmResult.result.joinOperators?

> `optional` **joinOperators**: `string`[]

#### llmResult.result.joinVariableNames?

> `optional` **joinVariableNames**: `string`[]

#### llmResult.result.secondDataset?

> `optional` **secondDataset**: `string`[]

#### llmResult.result.secondDatasetName?

> `optional` **secondDatasetName**: `string`

#### llmResult.success

> **success**: `boolean`
