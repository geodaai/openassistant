# Variable: geocoding

> `const` **geocoding**: `ExtendedTool`\<[`GeocodingFunctionArgs`](../type-aliases/GeocodingFunctionArgs.md), [`GeocodingLlmResult`](../type-aliases/GeocodingLlmResult.md), [`GeocodingAdditionalData`](../type-aliases/GeocodingAdditionalData.md), `never`\>

Defined in: [geocoding.ts:42](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/osm/src/geocoding.ts#L42)

Geocoding Tool

This tool converts addresses into geographic coordinates (latitude and longitude) using OpenStreetMap's Nominatim service.

Example user prompts:
- "Find the coordinates for 123 Main Street, New York"
- "What are the coordinates of the Eiffel Tower?"
- "Get the location of Central Park"

Example code:
```typescript
import { getVercelAiTool } from "@openassistant/osm";

const geocodingTool = getVercelAiTool('geocoding');

generateText({
  model: 'gpt-4o-mini',
  prompt: 'What are the coordinates of the Eiffel Tower?',
  tools: {geocoding: geocodingTool},
});
```
