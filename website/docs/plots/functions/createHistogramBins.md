# Function: createHistogramBins()

> **createHistogramBins**(`values`, `numberOfBins`): `object`

Defined in: [packages/tools/plots/src/echarts/histogram/utils.ts:25](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/plots/src/echarts/histogram/utils.ts#L25)

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
