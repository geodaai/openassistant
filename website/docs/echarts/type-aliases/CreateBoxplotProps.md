# Type Alias: CreateBoxplotProps

> **CreateBoxplotProps**: `object`

Defined in: [packages/echarts/src/boxplot/component/utils.ts:14](https://github.com/GeoDaCenter/openassistant/blob/0c688d870b87d67f5ae44bc9413af48292a3320a/packages/echarts/src/boxplot/component/utils.ts#L14)

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
