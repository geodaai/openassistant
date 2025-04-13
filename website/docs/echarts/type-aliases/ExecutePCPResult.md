# Type Alias: ExecutePCPResult

> **ExecutePCPResult**: `object`

Defined in: [packages/echarts/src/pcp/tool.ts:55](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/echarts/src/pcp/tool.ts#L55)

The result of the PCP tool.

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

#### additionalData.pcp

> **pcp**: [`ParallelCoordinateDataProps`](ParallelCoordinateDataProps.md)

#### additionalData.rawData

> **rawData**: `Record`\<`string`, `number`[]\>

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

#### llmResult.result.datasetName

> **datasetName**: `string`

#### llmResult.result.details

> **details**: `string`

#### llmResult.result.id

> **id**: `string`

#### llmResult.result.image?

> `optional` **image**: `string`

#### llmResult.result.variableNames

> **variableNames**: `string`[]

#### llmResult.success

> **success**: `boolean`
