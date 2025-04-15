# Type Alias: ScatterplotToolContext

> **ScatterplotToolContext**: `object`

Defined in: [packages/echarts/src/scatterplot/tool.ts:106](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/echarts/src/scatterplot/tool.ts#L106)

The context for the scatterplot tool.

## Type declaration

### config?

> `optional` **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.isExpanded?

> `optional` **isExpanded**: `boolean`

#### config.showLoess?

> `optional` **showLoess**: `boolean`

#### config.showRegressionLine?

> `optional` **showRegressionLine**: `boolean`

#### config.theme?

> `optional` **theme**: `string`

### getValues()

> **getValues**: (`datasetName`, `variableName`) => `Promise`\<`number`[]\>

#### Parameters

##### datasetName

`string`

##### variableName

`string`

#### Returns

`Promise`\<`number`[]\>

### onSelected()?

> `optional` **onSelected**: (`datasetName`, `selectedIndices`) => `void`

#### Parameters

##### datasetName

`string`

##### selectedIndices

`number`[]

#### Returns

`void`
