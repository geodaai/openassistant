# Type Alias: PCPToolContext

> **PCPToolContext**: `object`

Defined in: [packages/echarts/src/pcp/tool.ts:83](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/echarts/src/pcp/tool.ts#L83)

The context for the PCP tool.

## Type declaration

### config?

> `optional` **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.isExpanded?

> `optional` **isExpanded**: `boolean`

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
