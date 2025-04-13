# Type Alias: BubbleChartTool

> **BubbleChartTool**: *typeof* [`bubbleChart`](../variables/bubbleChart.md)

Defined in: [packages/echarts/src/bubble-chart/tool.ts:147](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/echarts/src/bubble-chart/tool.ts#L147)

The bubble chart tool.

To use it, you need to provide the implementation of the `getValues` function.

## Example

```ts
import { bubbleChart } from '@openassistant/echarts';

const bubbleChartTool = {
  ...bubbleChart,
  context: {
    getValues: async (datasetName, variableName) => {
      // return the values of the variable from the dataset
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};
```

### getValues()

See [BubbleChartFunctionContext](BubbleChartFunctionContext.md) for detailed usage.
