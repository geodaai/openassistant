# Variable: spatialFilter

> `const` **spatialFilter**: `object`

Defined in: [packages/tools/geoda/src/spatial\_join/spatial-filter.ts:3](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/geoda/src/spatial_join/spatial-filter.ts#L3)

## Type declaration

### component?

> `optional` **component**: `ElementType`\<`any`, keyof IntrinsicElements\>

### context?

> `optional` **context**: [`SpatialJoinFunctionContext`](../type-aliases/SpatialJoinFunctionContext.md)

### description

> **description**: `string`

### execute

> **execute**: `ExecuteFunction`\<[`SpatialJoinFunctionArgs`](../type-aliases/SpatialJoinFunctionArgs.md), [`SpatialJoinLlmResult`](../type-aliases/SpatialJoinLlmResult.md), [`SpatialJoinAdditionalData`](../type-aliases/SpatialJoinAdditionalData.md), [`SpatialJoinFunctionContext`](../type-aliases/SpatialJoinFunctionContext.md)\>

### onToolCompleted?

> `optional` **onToolCompleted**: `OnToolCompleted`

### parameters

> **parameters**: [`SpatialJoinFunctionArgs`](../type-aliases/SpatialJoinFunctionArgs.md)
