# Type Alias: DataClassifyLlmResult

> **DataClassifyLlmResult**: `object`

Defined in: [packages/geoda/src/data-classify/tool.ts:32](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/geoda/src/data-classify/tool.ts#L32)

## Type declaration

### error?

> `optional` **error**: `string`

### instruction?

> `optional` **instruction**: `string`

### result?

> `optional` **result**: `object`

#### result.breaks

> **breaks**: `number`[]

#### result.datasetName

> **datasetName**: `string`

#### result.hinge?

> `optional` **hinge**: `number`

#### result.k

> **k**: `number`

#### result.method

> **method**: `string`

#### result.variableName

> **variableName**: `string`

### success

> **success**: `boolean`
