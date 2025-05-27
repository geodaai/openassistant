# Function: registerTools()

> **registerTools**(): `object`

Defined in: [packages/tools/geoda/src/register-tools.ts:35](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/geoda/src/register-tools.ts#L35)

## Returns

`object`

### area

> **area**: `ExtendedTool`\<[`AreaFunctionArgs`](../type-aliases/AreaFunctionArgs.md), [`AreaLlmResult`](../type-aliases/AreaLlmResult.md), [`AreaAdditionalData`](../type-aliases/AreaAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

### buffer

> **buffer**: `ExtendedTool`\<[`BufferFunctionArgs`](../type-aliases/BufferFunctionArgs.md), [`BufferLlmResult`](../type-aliases/BufferLlmResult.md), [`BufferAdditionalData`](../type-aliases/BufferAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

### centroid

> **centroid**: `ExtendedTool`\<[`CentroidFunctionArgs`](../type-aliases/CentroidFunctionArgs.md), [`CentroidLlmResult`](../type-aliases/CentroidLlmResult.md), [`CentroidAdditionalData`](../type-aliases/CentroidAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

### dataClassify

> **dataClassify**: `ExtendedTool`\<[`DataClassifyFunctionArgs`](../type-aliases/DataClassifyFunctionArgs.md), [`DataClassifyLlmResult`](../type-aliases/DataClassifyLlmResult.md), [`DataClassifyAdditionalData`](../type-aliases/DataClassifyAdditionalData.md), [`DataClassifyFunctionContext`](../type-aliases/DataClassifyFunctionContext.md)\>

### dissolve

> **dissolve**: `ExtendedTool`\<[`DissolveFunctionArgs`](../type-aliases/DissolveFunctionArgs.md), [`DissolveLlmResult`](../type-aliases/DissolveLlmResult.md), [`DissolveAdditionalData`](../type-aliases/DissolveAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

### globalMoran

> **globalMoran**: `ExtendedTool`\<[`MoranScatterPlotFunctionArgs`](../type-aliases/MoranScatterPlotFunctionArgs.md), [`MoranScatterPlotLlmResult`](../type-aliases/MoranScatterPlotLlmResult.md), [`MoranScatterPlotAdditionalData`](../type-aliases/MoranScatterPlotAdditionalData.md), [`MoranScatterPlotFunctionContext`](../type-aliases/MoranScatterPlotFunctionContext.md)\>

### length

> **length**: `ExtendedTool`\<`ZodObject`\<\{ `datasetName`: `ZodOptional`\<`ZodString`\>; `distanceUnit`: `ZodDefault`\<`ZodEnum`\<\[`"KM"`, `"Mile"`\]\>\>; `geojson`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `datasetName`: `string`; `distanceUnit`: `"KM"` \| `"Mile"`; `geojson`: `string`; \}, \{ `datasetName`: `string`; `distanceUnit`: `"KM"` \| `"Mile"`; `geojson`: `string`; \}\>, \{ `distanceUnit`: `"KM"` \| `"Mile"`; `lengths`: `number`[]; `result`: `string`; `success`: `boolean`; \}, `never`, \{ `getGeometries`: () => `void`; \}\>

### lisa

> **lisa**: `ExtendedTool`\<[`LisaFunctionArgs`](../type-aliases/LisaFunctionArgs.md), [`LisaLlmResult`](../type-aliases/LisaLlmResult.md), [`LisaAdditionalData`](../type-aliases/LisaAdditionalData.md), [`LisaFunctionContext`](../type-aliases/LisaFunctionContext.md)\>

### perimeter

> **perimeter**: `ExtendedTool`\<[`PerimeterFunctionArgs`](../type-aliases/PerimeterFunctionArgs.md), [`PerimeterLlmResult`](../type-aliases/PerimeterLlmResult.md), [`PerimeterAdditionalData`](../type-aliases/PerimeterAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

### spatialFilter

> **spatialFilter**: `object`

#### spatialFilter.component?

> `optional` **component**: `ElementType`\<`any`, keyof IntrinsicElements\>

#### spatialFilter.context?

> `optional` **context**: [`SpatialJoinFunctionContext`](../type-aliases/SpatialJoinFunctionContext.md)

#### spatialFilter.description

> **description**: `string`

#### spatialFilter.execute

> **execute**: `ExecuteFunction`\<[`SpatialJoinFunctionArgs`](../type-aliases/SpatialJoinFunctionArgs.md), [`SpatialJoinLlmResult`](../type-aliases/SpatialJoinLlmResult.md), [`SpatialJoinAdditionalData`](../type-aliases/SpatialJoinAdditionalData.md), [`SpatialJoinFunctionContext`](../type-aliases/SpatialJoinFunctionContext.md)\>

#### spatialFilter.onToolCompleted?

> `optional` **onToolCompleted**: `OnToolCompleted`

#### spatialFilter.parameters

> **parameters**: [`SpatialJoinFunctionArgs`](../type-aliases/SpatialJoinFunctionArgs.md)

### spatialJoin

> **spatialJoin**: `ExtendedTool`\<[`SpatialJoinFunctionArgs`](../type-aliases/SpatialJoinFunctionArgs.md), [`SpatialJoinLlmResult`](../type-aliases/SpatialJoinLlmResult.md), [`SpatialJoinAdditionalData`](../type-aliases/SpatialJoinAdditionalData.md), [`SpatialJoinFunctionContext`](../type-aliases/SpatialJoinFunctionContext.md)\>

### spatialRegression

> **spatialRegression**: `ExtendedTool`\<[`SpatialRegressionFunctionArgs`](../type-aliases/SpatialRegressionFunctionArgs.md), [`SpatialRegressionLlmResult`](../type-aliases/SpatialRegressionLlmResult.md), [`SpatialRegressionAdditionalData`](../type-aliases/SpatialRegressionAdditionalData.md), [`SpatialRegressionFunctionContext`](../type-aliases/SpatialRegressionFunctionContext.md)\>

### spatialWeights

> **spatialWeights**: `ExtendedTool`\<[`SpatialWeightsFunctionArgs`](../type-aliases/SpatialWeightsFunctionArgs.md), [`SpatialWeightsLlmResult`](../type-aliases/SpatialWeightsLlmResult.md), [`SpatialWeightsAdditionalData`](../type-aliases/SpatialWeightsAdditionalData.md), [`SpatialWeightsFunctionContext`](../type-aliases/SpatialWeightsFunctionContext.md)\>
