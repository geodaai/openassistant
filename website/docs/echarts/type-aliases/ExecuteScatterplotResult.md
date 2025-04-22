# Type Alias: ExecuteScatterplotResult

> **ExecuteScatterplotResult**: `object`

Defined in: [packages/echarts/src/scatterplot/tool.ts:57](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/echarts/src/scatterplot/tool.ts#L57)

The result of the scatterplot tool.

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.datasetName

> **datasetName**: `string`

#### additionalData.id

> **id**: `string`

#### additionalData.isDraggable?

> `optional` **isDraggable**: `boolean`

#### additionalData.isExpanded?

> `optional` **isExpanded**: `boolean`

#### additionalData.onSelected()?

> `optional` **onSelected**: (`datasetName`, `selectedIndices`) => `void`

##### Parameters

###### datasetName

`string`

###### selectedIndices

`number`[]

##### Returns

`void`

#### additionalData.regressionResults?

> `optional` **regressionResults**: `object`

#### additionalData.regressionResults.regression

> **regression**: `object`

#### additionalData.regressionResults.regression.intercept

> **intercept**: `object`

#### additionalData.regressionResults.regression.intercept.estimate

> **estimate**: `number`

#### additionalData.regressionResults.regression.intercept.pValue

> **pValue**: `number`

#### additionalData.regressionResults.regression.intercept.standardError

> **standardError**: `number`

#### additionalData.regressionResults.regression.intercept.tStatistic

> **tStatistic**: `number`

#### additionalData.regressionResults.regression.rSquared

> **rSquared**: `number`

#### additionalData.regressionResults.regression.slope

> **slope**: `object`

#### additionalData.regressionResults.regression.slope.estimate

> **estimate**: `number`

#### additionalData.regressionResults.regression.slope.pValue

> **pValue**: `number`

#### additionalData.regressionResults.regression.slope.standardError

> **standardError**: `number`

#### additionalData.regressionResults.regression.slope.tStatistic

> **tStatistic**: `number`

#### additionalData.showLoess?

> `optional` **showLoess**: `boolean`

#### additionalData.showRegressionLine?

> `optional` **showRegressionLine**: `boolean`

#### additionalData.theme?

> `optional` **theme**: `string`

#### additionalData.xData

> **xData**: `number`[]

#### additionalData.xVariableName

> **xVariableName**: `string`

#### additionalData.yData

> **yData**: `number`[]

#### additionalData.yVariableName

> **yVariableName**: `string`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.instruction?

> `optional` **instruction**: `string`

#### llmResult.result?

> `optional` **result**: `object`

#### llmResult.result.datasetName

> **datasetName**: `string`

#### llmResult.result.details

> **details**: `string`

#### llmResult.result.id

> **id**: `string`

#### llmResult.result.xVariableName

> **xVariableName**: `string`

#### llmResult.result.yVariableName

> **yVariableName**: `string`

#### llmResult.success

> **success**: `boolean`
