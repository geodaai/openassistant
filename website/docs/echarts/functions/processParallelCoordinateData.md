# Function: processParallelCoordinateData()

> **processParallelCoordinateData**(`rawData`): [`ParallelCoordinateDataProps`](../type-aliases/ParallelCoordinateDataProps.md)

Defined in: [pcp/component/utils.ts:43](https://github.com/GeoDaCenter/openassistant/blob/aa41155e698e0b65b1716140c0c14440cdd9d76a/packages/echarts/src/pcp/component/utils.ts#L43)

Processes multiple variables to generate PCP data and raw data

## Parameters

### rawData

`RawDataType`

Object containing variable names as keys and their corresponding numeric values as arrays

## Returns

[`ParallelCoordinateDataProps`](../type-aliases/ParallelCoordinateDataProps.md)

Processed PCP data with statistical measures for each variable
