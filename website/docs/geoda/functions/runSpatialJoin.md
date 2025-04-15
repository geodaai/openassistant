# Function: runSpatialJoin()

> **runSpatialJoin**(`__namedParameters`): `Promise`\<\{ `additionalData`: \{ `firstDatasetName`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinResult`: `number`[][]; `joinValues`: `Record`\<`string`, `number`[]\>; `joinVariableNames`: `undefined` \| `string`[]; `secondDatasetName`: `string`; \}; `llmResult`: \{ `error`: `undefined`; `result`: \{ `details`: `string`; `firstDatasetName`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinVariableNames`: `undefined` \| `string`[]; `secondDatasetName`: `string`; \}; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/geoda/src/spatial-count/tool.ts:163](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/geoda/src/spatial-count/tool.ts#L163)

## Parameters

### \_\_namedParameters

#### firstDatasetName

`string`

#### getGeometries

(`datasetName`) => `SpatialGeometry`

#### getValues

[`GetValues`](../type-aliases/GetValues.md)

#### joinOperators?

`string`[]

#### joinVariableNames?

`string`[]

#### secondDatasetName

`string`

## Returns

`Promise`\<\{ `additionalData`: \{ `firstDatasetName`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinResult`: `number`[][]; `joinValues`: `Record`\<`string`, `number`[]\>; `joinVariableNames`: `undefined` \| `string`[]; `secondDatasetName`: `string`; \}; `llmResult`: \{ `error`: `undefined`; `result`: \{ `details`: `string`; `firstDatasetName`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinVariableNames`: `undefined` \| `string`[]; `secondDatasetName`: `string`; \}; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>
