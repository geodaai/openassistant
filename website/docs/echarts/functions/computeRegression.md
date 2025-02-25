# Function: computeRegression()

> **computeRegression**(`__namedParameters`): [`ComputeRegressionResult`](../type-aliases/ComputeRegressionResult.md)

Defined in: [scatterplot/component/scatter-regression.ts:45](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/echarts/src/scatterplot/component/scatter-regression.ts#L45)

Compute the regression for the scatterplot. If filteredIndex is provided, compute the regression for the selected points and the unselected points.
Otherwise, only the regression for all points is computed.

## Parameters

### \_\_namedParameters

[`ComputeRegressionProps`](../type-aliases/ComputeRegressionProps.md)

## Returns

[`ComputeRegressionResult`](../type-aliases/ComputeRegressionResult.md)

The results of the regression. See [ComputeRegressionResult](../type-aliases/ComputeRegressionResult.md) for more details.
