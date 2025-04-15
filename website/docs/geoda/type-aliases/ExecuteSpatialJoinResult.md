# Type Alias: ExecuteSpatialJoinResult

> **ExecuteSpatialJoinResult**: `object`

Defined in: [packages/geoda/src/spatial-count/tool.ts:76](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/geoda/src/spatial-count/tool.ts#L76)

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

#### additionalData.secondDatasetName

> **secondDatasetName**: `string`

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

#### llmResult.result.joinOperators?

> `optional` **joinOperators**: `string`[]

#### llmResult.result.joinVariableNames?

> `optional` **joinVariableNames**: `string`[]

#### llmResult.result.secondDatasetName

> **secondDatasetName**: `string`

#### llmResult.success

> **success**: `boolean`
