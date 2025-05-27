# Function: registerTools()

> **registerTools**(): `object`

Defined in: [packages/tools/osm/src/register-tools.ts:49](https://github.com/GeoDaCenter/openassistant/blob/bf312b357cb340f1f76fa8b62441fb39bcbce0ce/packages/tools/osm/src/register-tools.ts#L49)

## Returns

`object`

### geocoding

> **geocoding**: `ExtendedTool`\<[`GeocodingFunctionArgs`](../type-aliases/GeocodingFunctionArgs.md), [`GeocodingLlmResult`](../type-aliases/GeocodingLlmResult.md), [`GeocodingAdditionalData`](../type-aliases/GeocodingAdditionalData.md), `object`\>

### getUsCountyGeojson

> **getUsCountyGeojson**: `ExtendedTool`\<[`GetUsCountyGeojsonFunctionArgs`](../type-aliases/GetUsCountyGeojsonFunctionArgs.md), [`GetUsCountyGeojsonLlmResult`](../type-aliases/GetUsCountyGeojsonLlmResult.md), [`GetUsCountyGeojsonAdditionalData`](../type-aliases/GetUsCountyGeojsonAdditionalData.md), `object`\>

### getUsStateGeojson

> **getUsStateGeojson**: `ExtendedTool`\<[`GetUsStateGeojsonFunctionArgs`](../type-aliases/GetUsStateGeojsonFunctionArgs.md), [`GetUsStateGeojsonLlmResult`](../type-aliases/GetUsStateGeojsonLlmResult.md), [`GetUsStateGeojsonAdditionalData`](../type-aliases/GetUsStateGeojsonAdditionalData.md), `object`\>

### getUsZipcodeGeojson

> **getUsZipcodeGeojson**: `ExtendedTool`\<[`GetUsZipcodeGeojsonFunctionArgs`](../type-aliases/GetUsZipcodeGeojsonFunctionArgs.md), [`GetUsZipcodeGeojsonLlmResult`](../type-aliases/GetUsZipcodeGeojsonLlmResult.md), [`GetUsZipcodeGeojsonAdditionalData`](../type-aliases/GetUsZipcodeGeojsonAdditionalData.md), `object`\>

### isochrone

> **isochrone**: `ExtendedTool`\<[`IsochroneFunctionArgs`](../type-aliases/IsochroneFunctionArgs.md), [`IsochroneLlmResult`](../type-aliases/IsochroneLlmResult.md), [`IsochroneAdditionalData`](../type-aliases/IsochroneAdditionalData.md), [`MapboxToolContext`](../type-aliases/MapboxToolContext.md)\>

### queryUSZipcodes

> **queryUSZipcodes**: `ExtendedTool`\<[`QueryZipcodeFunctionArgs`](../type-aliases/QueryZipcodeFunctionArgs.md), [`QueryZipcodeLlmResult`](../type-aliases/QueryZipcodeLlmResult.md), [`QueryZipcodeAdditionalData`](../type-aliases/QueryZipcodeAdditionalData.md), `never`\>

### roads

> **roads**: `ExtendedTool`\<[`RoadsFunctionArgs`](../type-aliases/RoadsFunctionArgs.md), [`RoadsLlmResult`](../type-aliases/RoadsLlmResult.md), [`RoadsAdditionalData`](../type-aliases/RoadsAdditionalData.md), [`OsmToolContext`](../type-aliases/OsmToolContext.md)\>

### routing

> **routing**: `ExtendedTool`\<[`RoutingFunctionArgs`](../type-aliases/RoutingFunctionArgs.md), [`RoutingLlmResult`](../type-aliases/RoutingLlmResult.md), [`RoutingAdditionalData`](../type-aliases/RoutingAdditionalData.md), [`MapboxToolContext`](../type-aliases/MapboxToolContext.md)\>
