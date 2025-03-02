# Type Alias: CreateBoxplotProps

> **CreateBoxplotProps**: `object`

Defined in: [boxplot/component/utils.ts:14](https://github.com/GeoDaCenter/openassistant/blob/2a93b5036fdb3a9355cf5403bdecfb2525f1d8b3/packages/echarts/src/boxplot/component/utils.ts#L14)

Properties required to create a boxplot visualization

## Type declaration

### boundIQR

> **boundIQR**: `number`

Multiplier for the IQR to determine the whisker lengths
Common values are 1.5 (default) or 3.0

### data

> **data**: `object`

Input data object where each key represents a group/category and the value is an array of numbers

#### Index Signature

\[`key`: `string`\]: `number`[]
