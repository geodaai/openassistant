# Function: createHistogramBins()

> **createHistogramBins**(`values`, `numberOfBins`): `object`

Defined in: [histogram/component/utils.ts:15](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/echarts/src/histogram/component/utils.ts#L15)

Create histogram bins.

## Parameters

### values

(`string` \| `number`)[]

The values of the variable (can be numbers or strings).

### numberOfBins

`number` = `5`

The number of bins to create (only used for numeric values).

## Returns

`object`

The histogram bins.

### barDataIndexes

> **barDataIndexes**: `number`[][]

### breaks

> **breaks**: `number`[]

### counts

> **counts**: `number`[]

### histogramData

> **histogramData**: [`HistogramDataProps`](../type-aliases/HistogramDataProps.md)[]

### indices

> **indices**: `number`[][]

## Throws

Error if the number of unique string values exceeds 20
