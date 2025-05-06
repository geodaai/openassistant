# Function: runSpatialJoin()

> **runSpatialJoin**(`__namedParameters`): `Promise`\<\{ `additionalData`: \{ `firstDatasetName`: `string`; `joinedDataset`: `unknown`[] \| `FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>; `joinedDatasetId`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinResult`: `number`[][]; `joinValues`: `Record`\<`string`, `number`[]\>; `joinVariableNames`: `undefined` \| `string`[]; `secondDatasetName`: `string`; \}; `llmResult`: \{ `error`: `undefined`; `result`: \{ `details`: `string`; `firstDatasetName`: `string`; `firstTwoRows`: `object`[]; `joinedDatasetId`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinVariableNames`: `undefined` \| `string`[]; `secondDatasetName`: `string`; \}; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/geoda/src/spatial\_join/tool.ts:200](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/geoda/src/spatial_join/tool.ts#L200)

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

#### secondDatasetName

`string`

## Returns

`Promise`\<\{ `additionalData`: \{ `firstDatasetName`: `string`; `joinedDataset`: `unknown`[] \| `FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>; `joinedDatasetId`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinResult`: `number`[][]; `joinValues`: `Record`\<`string`, `number`[]\>; `joinVariableNames`: `undefined` \| `string`[]; `secondDatasetName`: `string`; \}; `llmResult`: \{ `error`: `undefined`; `result`: \{ `details`: `string`; `firstDatasetName`: `string`; `firstTwoRows`: `object`[]; `joinedDatasetId`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinVariableNames`: `undefined` \| `string`[]; `secondDatasetName`: `string`; \}; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>
