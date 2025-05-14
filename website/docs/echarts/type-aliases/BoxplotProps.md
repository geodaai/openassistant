# Type Alias: BoxplotProps

> **BoxplotProps**: `object`

Defined in: [packages/echarts/src/boxplot/utils.ts:31](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/echarts/src/boxplot/utils.ts#L31)

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
