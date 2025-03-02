# Function: computeRegression()

> **computeRegression**(`props`): [`ComputeRegressionResult`](../type-aliases/ComputeRegressionResult.md)

Defined in: [scatterplot/component/scatter-regression.ts:46](https://github.com/GeoDaCenter/openassistant/blob/65e761aafcb8b3d759c0e5ae9c1cbe8e024f7128/packages/echarts/src/scatterplot/component/scatter-regression.ts#L46)

Compute the regression for the scatterplot. If filteredIndex is provided, compute the regression for the selected points and the unselected points.
Otherwise, only the regression for all points is computed.

## Parameters

### props

[`ComputeRegressionProps`](../type-aliases/ComputeRegressionProps.md)

The properties for computing regression

## Returns

[`ComputeRegressionResult`](../type-aliases/ComputeRegressionResult.md)

The results of the regression. See [ComputeRegressionResult](../type-aliases/ComputeRegressionResult.md) for more details.
