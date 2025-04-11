# Function: processParallelCoordinateData()

> **processParallelCoordinateData**(`rawData`): [`ParallelCoordinateDataProps`](../type-aliases/ParallelCoordinateDataProps.md)

Defined in: [packages/echarts/src/pcp/component/utils.ts:43](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/echarts/src/pcp/component/utils.ts#L43)

Processes multiple variables to generate PCP data and raw data

## Parameters

### rawData

`RawDataType`

Object containing variable names as keys and their corresponding numeric values as arrays

## Returns

[`ParallelCoordinateDataProps`](../type-aliases/ParallelCoordinateDataProps.md)

Processed PCP data with statistical measures for each variable
