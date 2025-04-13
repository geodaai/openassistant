# Type Alias: BoxplotToolProps

> **BoxplotToolProps**: `object`

Defined in: [packages/echarts/src/boxplot/definition.ts:120](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/echarts/src/boxplot/definition.ts#L120)

Properties for configuring the boxplot tool.

## Type declaration

### boxplotComponent()?

> `optional` **boxplotComponent**: () => `React.ReactNode`

#### Returns

`React.ReactNode`

### config?

> `optional` **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.theme?

> `optional` **theme**: `string`

### getValues

> **getValues**: `GetValues`

### tool?

> `optional` **tool**: `RegisterFunctionCallingProps`

## Param

Function to retrieve dataset values. See [GetValues](GetValues.md).

## Param

Optional custom function properties to override defaults.

## Param

Optional visual and behavioral configuration.

## Param

Visual theme for the boxplot ('light' or 'dark').

## Param

Whether the boxplot can be dragged to other containers.

## Param

Optional custom React component to render the boxplot.
