# Function: BoxplotComponentContainer()

> **BoxplotComponentContainer**(`props`): `null` \| `Element`

Defined in: [packages/echarts/src/boxplot/component/box-plot-component.tsx:31](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/echarts/src/boxplot/component/box-plot-component.tsx#L31)

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
