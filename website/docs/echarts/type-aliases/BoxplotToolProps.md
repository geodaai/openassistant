# Type Alias: BoxplotToolProps

> **BoxplotToolProps**: `object`

Defined in: [boxplot/definition.ts:105](https://github.com/GeoDaCenter/openassistant/blob/aa41155e698e0b65b1716140c0c14440cdd9d76a/packages/echarts/src/boxplot/definition.ts#L105)

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
