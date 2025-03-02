# Function: handleBrushSelection()

> **handleBrushSelection**(`eChart`, `brushed`, `datasetName`, `onSelected`?): `void`

Defined in: [echarts-updater.tsx:33](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/echarts/src/echarts-updater.tsx#L33)

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

### onSelected?

`OnBrushedCallback`

Optional callback function to handle brush selection

## Returns

`void`
