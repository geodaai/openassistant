# Type Alias: BoxplotProps

> **BoxplotProps**: `object`

Defined in: [packages/tools/plots/src/echarts/boxplot/utils.ts:31](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/plots/src/echarts/boxplot/utils.ts#L31)

Statistical properties calculated for each boxplot

## Type declaration

### high

> **high**: `number`

Upper whisker value (Q3 + boundIQR * IQR)

### iqr

> **iqr**: `number`

Interquartile range (Q3 - Q1)

### low

> **low**: `number`

Lower whisker value (Q1 - boundIQR * IQR)

### mean

> **mean**: `number`

Arithmetic mean of the data

### name

> **name**: `string`

Name/identifier of the data group

### q1

> **q1**: `number`

First quartile (25th percentile)

### q2

> **q2**: `number`

Median (50th percentile)

### q3

> **q3**: `number`

Third quartile (75th percentile)

### std

> **std**: `number`

Standard deviation of the data
