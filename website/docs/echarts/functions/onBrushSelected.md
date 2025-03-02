# Function: onBrushSelected()

> **onBrushSelected**(`params`, `id`, `datasetName`, `eChart`?, `onSelected`?): `void`

Defined in: [echarts-updater.tsx:61](https://github.com/GeoDaCenter/openassistant/blob/aa41155e698e0b65b1716140c0c14440cdd9d76a/packages/echarts/src/echarts-updater.tsx#L61)

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

### onSelected?

`OnBrushedCallback`

Optional callback function to handle brush selection

## Returns

`void`
