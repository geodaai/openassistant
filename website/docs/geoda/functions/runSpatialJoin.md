# Function: runSpatialJoin()

> **runSpatialJoin**(`__namedParameters`): `Promise`\<\{ `additionalData`: \{ `firstDatasetName`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinResult`: `number`[][]; `joinValues`: `Record`\<`string`, `number`[]\>; `joinVariableNames`: `undefined` \| `string`[]; \}; `llmResult`: \{ `error`: `undefined`; `result`: \{ `details`: `string`; `firstDatasetName`: `string`; `firstTwoRows`: `object`[]; `joinOperators`: `undefined` \| `string`[]; `joinVariableNames`: `undefined` \| `string`[]; \}; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/geoda/src/spatial-count/tool.ts:163](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/geoda/src/spatial-count/tool.ts#L163)

## Parameters

### \_\_namedParameters

#### firstDatasetName

`string`

#### getGeometries

[`GetGeometries`](../type-aliases/GetGeometries.md)

#### getValues

[`GetValues`](../type-aliases/GetValues.md)

#### joinOperators?

`string`[]

#### joinVariableNames?

`string`[]

#### previousExecutionOutput?

\{ `data`: \{ `geojson`: `FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>; \}; \}

#### previousExecutionOutput.data?

\{ `geojson`: `FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>; \}

#### previousExecutionOutput.data.geojson?

`FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>

#### secondDataset

`string` \| `string`[]

## Returns

`Promise`\<\{ `additionalData`: \{ `firstDatasetName`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinResult`: `number`[][]; `joinValues`: `Record`\<`string`, `number`[]\>; `joinVariableNames`: `undefined` \| `string`[]; \}; `llmResult`: \{ `error`: `undefined`; `result`: \{ `details`: `string`; `firstDatasetName`: `string`; `firstTwoRows`: `object`[]; `joinOperators`: `undefined` \| `string`[]; `joinVariableNames`: `undefined` \| `string`[]; \}; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>
