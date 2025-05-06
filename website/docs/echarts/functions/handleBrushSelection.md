# Function: handleBrushSelection()

> **handleBrushSelection**(`eChart`, `brushed`, `datasetName`, `onBrushed`?, `onSelected`?): `void`

Defined in: [echarts-updater.tsx:45](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/echarts/src/echarts-updater.tsx#L45)

Handles brush selection events from ECharts components.
Manages highlighting and callback execution for brushed data points.

## Parameters

### eChart

ECharts instance

`undefined` | `EChartsType`

### brushed

`number`[]

Array of indices that are currently brushed

### datasetName

`string`

Name of the dataset being brushed

### onBrushed?

`OnBrushedCallback`

Optional callback function to handle brush selection

### onSelected?

[`OnSelected`](../type-aliases/OnSelected.md)

Optional callback function to handle brush selection

## Returns

`void`
