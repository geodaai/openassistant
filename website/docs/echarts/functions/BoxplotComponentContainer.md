# Function: BoxplotComponentContainer()

> **BoxplotComponentContainer**(`props`): `null` \| `Element`

Defined in: [boxplot/component/box-plot-component.tsx:28](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/echarts/src/boxplot/component/box-plot-component.tsx#L28)

BoxplotComponentContainer for rendering box plot visualizations with expandable container.
With expandable container, the box plot can be:
- expanded to a modal dialog with box plots rendered in vertical direction and with detailed statistics table.
- dragged and dropped to other places.
- resized.
- have a tooltip with detailed statistics.

## Parameters

### props

[`BoxplotOutputData`](../type-aliases/BoxplotOutputData.md)

[BoxplotOutputData](../type-aliases/BoxplotOutputData.md) Configuration and data for the box plot

## Returns

`null` \| `Element`

Box plot visualization with optional detailed statistics table
