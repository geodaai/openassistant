# Function: onBrushSelected()

> **onBrushSelected**(`params`, `id`, `datasetName`, `eChart`?, `onSelected`?): `void`

Defined in: [echarts-updater.tsx:63](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/echarts/src/echarts-updater.tsx#L63)

Handles the brush selection event from ECharts and processes the selected data indices.

## Parameters

### params

The brush selection event parameters from ECharts

#### batch

`object`[]

Array of batch selection data

### id

`string`

The identifier for the chart instance

### datasetName

`string`

Name of the dataset being visualized

### eChart?

`EChartsType`

Optional ECharts instance reference

### onSelected?

`OnBrushedCallback`

Optional callback function to handle brush selection

## Returns

`void`
