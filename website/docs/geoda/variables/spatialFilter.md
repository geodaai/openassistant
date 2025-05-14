# Variable: spatialFilter

> `const` **spatialFilter**: `object`

Defined in: [packages/geoda/src/spatial\_join/spatial-filter.ts:3](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/geoda/src/spatial_join/spatial-filter.ts#L3)

## Type declaration

### component?

> `optional` **component**: `ElementType`\<`any`, keyof IntrinsicElements\>

### context?

> `optional` **context**: [`SpatialJoinFunctionContext`](../type-aliases/SpatialJoinFunctionContext.md)

### description

> **description**: `string`

### execute

> **execute**: `ExecuteFunction`\<[`SpatialJoinFunctionArgs`](../type-aliases/SpatialJoinFunctionArgs.md), [`SpatialJoinLlmResult`](../type-aliases/SpatialJoinLlmResult.md), [`SpatialJoinAdditionalData`](../type-aliases/SpatialJoinAdditionalData.md), [`SpatialJoinFunctionContext`](../type-aliases/SpatialJoinFunctionContext.md)\>

### parameters

> **parameters**: [`SpatialJoinFunctionArgs`](../type-aliases/SpatialJoinFunctionArgs.md)

### priority?

> `optional` **priority**: `number`
