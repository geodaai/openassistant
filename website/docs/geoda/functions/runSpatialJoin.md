# Function: runSpatialJoin()

> **runSpatialJoin**(`__namedParameters`): `Promise`\<\{ `additionalData`: \{ `[key: string]`: `undefined` \| `string` \| `number`[][] \| `string`[] \| `Record`\<`string`, `number`[]\> \| \{ `content`: \{ `features`: `any`[]; `type`: `string`; \}; `type`: `string`; \} \| \{ `content`: `any`[][]; `type`: `string`; \};  `datasetName`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinResult`: `number`[][]; `joinValues`: `Record`\<`string`, `number`[]\>; `joinVariableNames`: `undefined` \| `string`[]; `leftDatasetName`: `string`; `rightDatasetName`: `string`; \}; `llmResult`: \{ `datasetName`: `string`; `error`: `undefined`; `firstTwoRows`: `object`[]; `joinStats`: \{ `averageCount`: `number`; `maxCount`: `number`; `minCount`: `number`; `totalCount`: `number`; \}; `result`: `string`; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `datasetName`: `undefined`; `error`: `string`; `firstTwoRows`: `undefined`; `joinStats`: `undefined`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/tools/geoda/src/spatial\_join/tool.ts:207](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/geoda/src/spatial_join/tool.ts#L207)

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

`Promise`\<\{ `additionalData`: \{ `[key: string]`: `undefined` \| `string` \| `number`[][] \| `string`[] \| `Record`\<`string`, `number`[]\> \| \{ `content`: \{ `features`: `any`[]; `type`: `string`; \}; `type`: `string`; \} \| \{ `content`: `any`[][]; `type`: `string`; \};  `datasetName`: `string`; `joinOperators`: `undefined` \| `string`[]; `joinResult`: `number`[][]; `joinValues`: `Record`\<`string`, `number`[]\>; `joinVariableNames`: `undefined` \| `string`[]; `leftDatasetName`: `string`; `rightDatasetName`: `string`; \}; `llmResult`: \{ `datasetName`: `string`; `error`: `undefined`; `firstTwoRows`: `object`[]; `joinStats`: \{ `averageCount`: `number`; `maxCount`: `number`; `minCount`: `number`; `totalCount`: `number`; \}; `result`: `string`; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `datasetName`: `undefined`; `error`: `string`; `firstTwoRows`: `undefined`; `joinStats`: `undefined`; `result`: `undefined`; `success`: `boolean`; \}; \}\>
