# Function: createBoxplot()

> **createBoxplot**(`__namedParameters`): [`BoxplotDataProps`](../type-aliases/BoxplotDataProps.md)

Defined in: [boxplot/component/utils.ts:89](https://github.com/GeoDaCenter/openassistant/blob/1b6e044b8153114911daa09cb063c51a2d620732/packages/echarts/src/boxplot/component/utils.ts#L89)

Create a boxplot from a list of numbers and option boundIQR (1.5 or 3.0)

## Parameters

### \_\_namedParameters

[`CreateBoxplotProps`](../type-aliases/CreateBoxplotProps.md)

## Returns

[`BoxplotDataProps`](../type-aliases/BoxplotDataProps.md)

The boxplot data

### Example: single boxplot

```ts
const data = {
  'samples': [1, 2, 3, 4, 5],
};
const boundIQR = 1.5;
const boxplotData = createBoxplot({data, boundIQR});
```

### Example: multiple boxplots

```ts
const data = {
  'samples': [1, 2, 3, 4, 5],
  'samples2': [6, 7, 8, 9, 10],
};
const boundIQR = 1.5;
const boxplotData = createBoxplot({data, boundIQR});
```
