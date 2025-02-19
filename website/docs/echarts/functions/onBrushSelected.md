# Function: onBrushSelected()

> **onBrushSelected**(`params`, `id`, `datasetName`, `eChart`?, `onSelected`?): `void`

Defined in: [echarts-updater.tsx:65](https://github.com/GeoDaCenter/openassistant/blob/1a6f158a9bc0914d446c35a467a546a572748a5e/packages/echarts/src/echarts-updater.tsx#L65)

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
