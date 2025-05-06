# Function: onBrushSelected()

> **onBrushSelected**(`params`, `id`, `datasetName`, `eChart`?, `onBrushed`?, `onSelected`?): `void`

Defined in: [echarts-updater.tsx:77](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/echarts/src/echarts-updater.tsx#L77)

Handles the brush selection event from ECharts and processes the selected data indices.

## Parameters

### params

The brush selection event parameters from ECharts

#### batch

`object`[]

Array of batch selection data containing selected data indices

### id

`string`

The identifier for the chart instance

### datasetName

`string`

Name of the dataset being visualized

### eChart?

`EChartsType`

Optional ECharts instance reference

### onBrushed?

`OnBrushedCallback`

### onSelected?

[`OnSelected`](../type-aliases/OnSelected.md)

Optional callback function to handle brush selection

## Returns

`void`
