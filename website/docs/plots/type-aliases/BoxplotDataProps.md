# Type Alias: BoxplotDataProps

> **BoxplotDataProps**: `object`

Defined in: [packages/tools/plots/src/echarts/boxplot/utils.ts:55](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/plots/src/echarts/boxplot/utils.ts#L55)

Output data structure compatible with eCharts boxplot series

## Type declaration

### boxplots

> **boxplots**: [`BoxplotProps`](BoxplotProps.md)[]

Array of boxplot statistical properties for each data group

### meanPoint

> **meanPoint**: \[`string`, `number`\][]

Array of [groupName, meanValue] pairs for rendering mean points
