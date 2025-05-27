# Type Alias: BoxplotDataProps

> **BoxplotDataProps**: `object`

Defined in: [packages/tools/plots/src/echarts/boxplot/utils.ts:55](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/plots/src/echarts/boxplot/utils.ts#L55)

Output data structure compatible with eCharts boxplot series

## Type declaration

### boxplots

> **boxplots**: [`BoxplotProps`](BoxplotProps.md)[]

Array of boxplot statistical properties for each data group

### meanPoint

> **meanPoint**: \[`string`, `number`\][]

Array of [groupName, meanValue] pairs for rendering mean points
