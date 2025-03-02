# Function: chowTest()

> **chowTest**(`x1`, `y1`, `x2`, `y2`): [`ChowTestResult`](../type-aliases/ChowTestResult.md)

Defined in: [math/linear-regression.ts:340](https://github.com/GeoDaCenter/openassistant/blob/a5eebdb32e6bf1b6b4eedf634485568edcefaa57/packages/echarts/src/math/linear-regression.ts#L340)

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
