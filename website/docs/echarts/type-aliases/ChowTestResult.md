# Type Alias: ChowTestResult

> **ChowTestResult**: `object`

Defined in: [math/linear-regression.ts:326](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/echarts/src/math/linear-regression.ts#L326)

Performs Chow test to check for structural break in linear regression
The fStat is the F-statistic and the pValue is the p-value.
If the pValue is less than 0.05, we can reject the null hypothesis and conclude that the regression is different between the first and second subset.
The larger the fStat, the more significant the difference between the two subsets.

## Type declaration

### fStat

> **fStat**: `number`

### pValue

> **pValue**: `number`

## Param

First subset x values

## Param

First subset y values

## Param

Second subset x values

## Param

Second subset y values

## Returns

Object containing F-statistic and p-value
