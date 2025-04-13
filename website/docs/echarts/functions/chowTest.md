# Function: chowTest()

> **chowTest**(`x1`, `y1`, `x2`, `y2`): [`ChowTestResult`](../type-aliases/ChowTestResult.md)

Defined in: [packages/echarts/src/math/linear-regression.ts:340](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/echarts/src/math/linear-regression.ts#L340)

Perform the Chow test to check if the regression is different between the first and second subset.

## Parameters

### x1

`number`[]

The first subset x values.

### y1

`number`[]

The first subset y values.

### x2

`number`[]

The second subset x values.

### y2

`number`[]

The second subset y values.

## Returns

[`ChowTestResult`](../type-aliases/ChowTestResult.md)

The results of the Chow test. See [ChowTestResult](../type-aliases/ChowTestResult.md) for more details.
