# Type Alias: BoxplotProps

> **BoxplotProps**: `object`

Defined in: [boxplot/component/utils.ts:31](https://github.com/GeoDaCenter/openassistant/blob/aa41155e698e0b65b1716140c0c14440cdd9d76a/packages/echarts/src/boxplot/component/utils.ts#L31)

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
