# Function: registerTools()

> **registerTools**(): `object`

Defined in: [packages/tools/map/src/register-tools.ts:14](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/map/src/register-tools.ts#L14)

## Returns

`object`

### downloadMapData

> **downloadMapData**: `ExtendedTool`\<`ZodObject`\<\{ `url`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `url`: `string`; \}, \{ `url`: `string`; \}\>, \{ `datasetName`: `string`; `error`: `undefined`; `fields`: `any`; `instructions`: `string`; `result`: `string`; `success`: `boolean`; \}, \{ `[key: string]`: `any`;  `datasetName`: `string`; \}, `never`\>

### keplergl

> **keplergl**: `ExtendedTool`\<[`KeplerGlToolArgs`](../type-aliases/KeplerGlToolArgs-1.md), [`KeplerGlToolLlmResult`](../type-aliases/KeplerGlToolLlmResult.md), [`KeplerGlToolAdditionalData`](../type-aliases/KeplerGlToolAdditionalData.md), [`MapToolContext`](../type-aliases/MapToolContext.md)\>

### leaflet

> **leaflet**: `ExtendedTool`\<[`LeafletToolArgs`](../type-aliases/LeafletToolArgs.md), [`LeafletToolLlmResult`](../type-aliases/LeafletToolLlmResult.md), [`LeafletToolAdditionalData`](../type-aliases/LeafletToolAdditionalData.md), [`MapToolContext`](../type-aliases/MapToolContext.md)\>
