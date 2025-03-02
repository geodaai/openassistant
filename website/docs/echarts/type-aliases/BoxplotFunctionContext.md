# Type Alias: BoxplotFunctionContext

> **BoxplotFunctionContext**: `object`

Defined in: [boxplot/definition.ts:37](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/echarts/src/boxplot/definition.ts#L37)

Configuration and callback context for the boxplot function.

## Type declaration

### config?

> `optional` **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.theme?

> `optional` **theme**: `string`

### getValues

> **getValues**: `GetValues`

### onSelected?

> `optional` **onSelected**: [`OnSelectedCallback`](OnSelectedCallback.md)

## Param

Function to retrieve values from a dataset. See [GetValues](GetValues.md).

## Param

Optional callback to handle selection events. See [OnSelectedCallback](OnSelectedCallback.md).

## Param

Optional configuration object for the boxplot.

## Param

Visual theme for the boxplot ('light' or 'dark').

## Param

Whether the boxplot can be dragged to other containers.
