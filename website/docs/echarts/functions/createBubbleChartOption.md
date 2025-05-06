# Function: createBubbleChartOption()

> **createBubbleChartOption**(`data`): `EChartsOption`

Defined in: [bubble-chart/component/bubble-chart-option.ts:35](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/echarts/src/bubble-chart/component/bubble-chart-option.ts#L35)

Creates an ECharts option configuration for rendering a bubble chart.

## Parameters

### data

#### variableColor?

\{ `name`: `string`; `values`: (`string` \| `number`)[]; \}

#### variableColor.name

`string`

#### variableColor.values

(`string` \| `number`)[]

#### variableSize

\{ `name`: `string`; `values`: `number`[]; \}

#### variableSize.name

`string`

#### variableSize.values

`number`[]

#### variableX

\{ `name`: `string`; `values`: `number`[]; \}

#### variableX.name

`string`

#### variableX.values

`number`[]

#### variableY

\{ `name`: `string`; `values`: `number`[]; \}

#### variableY.name

`string`

#### variableY.values

`number`[]

## Returns

`EChartsOption`

An ECharts option configuration object that defines:
- Scatter plot with variable-sized bubbles
- Customizable bubble colors
- Interactive tooltips showing data points' details
- Brush selection tools
- Responsive grid layout
- Optimized animation settings for performance

## Example

```ts
const data = {
  variableX: { name: 'GDP', values: [1000, 2000, 3000] },
  variableY: { name: 'Life Expectancy', values: [70, 75, 80] },
  variableSize: { name: 'Population', values: [1000000, 2000000, 3000000] },
  variableColor: { name: 'Region', values: ['A', 'B', 'C'] }
};
const option = createBubbleChartOption({ data });
```
