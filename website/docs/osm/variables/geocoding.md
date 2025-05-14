# Variable: geocoding

> `const` **geocoding**: `ExtendedTool`\<[`GeocodingFunctionArgs`](../type-aliases/GeocodingFunctionArgs.md), [`GeocodingLlmResult`](../type-aliases/GeocodingLlmResult.md), [`GeocodingAdditionalData`](../type-aliases/GeocodingAdditionalData.md), `object`\>

Defined in: [packages/osm/src/geocoding.ts:49](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/osm/src/geocoding.ts#L49)

Geocoding Tool

This tool converts addresses into geographic coordinates (latitude and longitude) using OpenStreetMap's Nominatim service.

Example user prompts:
- "Find the coordinates for 123 Main Street, New York"
- "What are the coordinates of the Eiffel Tower?"
- "Get the location of Central Park"

## Example

```typescript
import { getOsmTool, OsmToolNames } from "@openassistant/osm";

const geocodingTool = getOsmTool(OsmToolNames.geocoding);

streamText({
  model: openai('gpt-4o'),
  prompt: 'What are the coordinates of the Eiffel Tower?',
  tools: {
    geocoding: geocodingTool,
  },
});
```

For a more complete example, see the [OSM Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_osm_example).
