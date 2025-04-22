# Type Alias: ExecuteMoranScatterPlotResult

> **ExecuteMoranScatterPlotResult**: `object`

Defined in: [packages/geoda/src/moran-scatterplot/tool.ts:46](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/moran-scatterplot/tool.ts#L46)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.datasetName

> **datasetName**: `string`

#### additionalData.isDraggable?

> `optional` **isDraggable**: `boolean`

#### additionalData.isExpanded?

> `optional` **isExpanded**: `boolean`

#### additionalData.lagValues

> **lagValues**: `number`[]

#### additionalData.regression

> **regression**: `SimpleLinearRegressionResult`

#### additionalData.slope

> **slope**: `number`

#### additionalData.theme?

> `optional` **theme**: `string`

#### additionalData.values

> **values**: `number`[]

#### additionalData.variableName

> **variableName**: `string`

#### additionalData.weights

> **weights**: `number`[][]

#### additionalData.weightsId

> **weightsId**: `string`

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

#### llmResult.result.details

> **details**: `string`

#### llmResult.result.globalMoranI

> **globalMoranI**: `number`

#### llmResult.result.variableName

> **variableName**: `string`

#### llmResult.result.weightsId

> **weightsId**: `string`

#### llmResult.success

> **success**: `boolean`
