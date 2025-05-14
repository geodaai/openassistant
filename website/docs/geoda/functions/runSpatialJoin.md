# Function: runSpatialJoin()

> **runSpatialJoin**(`__namedParameters`): `Promise`\<\{ `additionalData`: \{ `[key: string]`: `undefined` \| `string` \| `unknown`[] \| `FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>;  `datasetName`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinVariableNames`: `undefined` \| `string`[]; `leftDatasetName`: `string`; `rightDatasetName`: `string`; \}; `llmResult`: \{ `datasetName`: `string`; `error`: `undefined`; `firstTwoRows`: `object`[]; `joinStats`: \{ `averageCount`: `number`; `maxCount`: `number`; `minCount`: `number`; `totalCount`: `number`; \}; `result`: `string`; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `datasetName`: `undefined`; `error`: `string`; `firstTwoRows`: `undefined`; `joinStats`: `undefined`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/geoda/src/spatial\_join/tool.ts:199](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/geoda/src/spatial_join/tool.ts#L199)

## Parameters

### \_\_namedParameters

#### getGeometries

[`GetGeometries`](../type-aliases/GetGeometries.md)

#### getValues

[`GetValues`](../type-aliases/GetValues.md)

#### joinOperators?

`string`[]

#### joinVariableNames?

`string`[]

#### leftDatasetName

`string`

#### previousExecutionOutput?

\{ `data`: \{ `geojson`: `FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>; \}; \}

#### previousExecutionOutput.data?

\{ `geojson`: `FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>; \}

#### previousExecutionOutput.data.geojson?

`FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>

#### rightDatasetName

`string`

## Returns

`Promise`\<\{ `additionalData`: \{ `[key: string]`: `undefined` \| `string` \| `unknown`[] \| `FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>;  `datasetName`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinVariableNames`: `undefined` \| `string`[]; `leftDatasetName`: `string`; `rightDatasetName`: `string`; \}; `llmResult`: \{ `datasetName`: `string`; `error`: `undefined`; `firstTwoRows`: `object`[]; `joinStats`: \{ `averageCount`: `number`; `maxCount`: `number`; `minCount`: `number`; `totalCount`: `number`; \}; `result`: `string`; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `datasetName`: `undefined`; `error`: `string`; `firstTwoRows`: `undefined`; `joinStats`: `undefined`; `result`: `undefined`; `success`: `boolean`; \}; \}\>
