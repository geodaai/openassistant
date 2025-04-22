# Type Alias: ExecuteDataClassifyResult

> **ExecuteDataClassifyResult**: `object`

Defined in: [packages/geoda/src/data-classify/tool.ts:120](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/data-classify/tool.ts#L120)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.breaks

> **breaks**: `number`[]

#### additionalData.datasetName

> **datasetName**: `string`

#### additionalData.hinge?

> `optional` **hinge**: `number`

#### additionalData.k

> **k**: `number`

#### additionalData.method

> **method**: `string`

#### additionalData.variableName

> **variableName**: `string`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.instruction?

> `optional` **instruction**: `string`

#### llmResult.result?

> `optional` **result**: `object`

#### llmResult.result.breaks

> **breaks**: `number`[]

#### llmResult.result.datasetName

> **datasetName**: `string`

#### llmResult.result.hinge?

> `optional` **hinge**: `number`

#### llmResult.result.k

> **k**: `number`

#### llmResult.result.method

> **method**: `string`

#### llmResult.result.variableName

> **variableName**: `string`

#### llmResult.success

> **success**: `boolean`
