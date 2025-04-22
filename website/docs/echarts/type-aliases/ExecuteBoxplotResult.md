# Type Alias: ExecuteBoxplotResult

> **ExecuteBoxplotResult**: `object`

Defined in: [packages/echarts/src/boxplot/tool.ts:100](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/echarts/src/boxplot/tool.ts#L100)

The result of the boxplot tool.

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.boundIQR

> **boundIQR**: `number`

#### additionalData.boxplotData

> **boxplotData**: [`BoxplotDataProps`](BoxplotDataProps.md)

#### additionalData.data?

> `optional` **data**: `Record`\<`string`, `number`[]\>

#### additionalData.datasetName

> **datasetName**: `string`

#### additionalData.id

> **id**: `string`

#### additionalData.isDraggable?

> `optional` **isDraggable**: `boolean`

#### additionalData.isExpanded?

> `optional` **isExpanded**: `boolean`

#### additionalData.theme?

> `optional` **theme**: `string`

#### additionalData.variables

> **variables**: `string`[]

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.instruction?

> `optional` **instruction**: `string`

#### llmResult.result?

> `optional` **result**: `object`

#### llmResult.result.boundIQR

> **boundIQR**: `number`

#### llmResult.result.boxplotData

> **boxplotData**: [`BoxplotDataProps`](BoxplotDataProps.md)

#### llmResult.result.datasetName

> **datasetName**: `string`

#### llmResult.result.id

> **id**: `string`

#### llmResult.success

> **success**: `boolean`
