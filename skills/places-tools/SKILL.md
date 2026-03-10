---
name: places-tools
description: Use @openassistant/places tools (Foursquare place search + geotagging and SearchAPI-powered web search) in TypeScript/JavaScript apps; includes required API keys and context wiring.
---

# Places tools (@openassistant/places)

Use this skill when you need POI/place search, to geotag a coordinate, or to run a structured web search and store results as a dataset.

## Quick start

```ts
import { placeSearch, geoTagging, webSearch } from '@openassistant/places';
import { convertToVercelAiTool } from '@openassistant/utils';

const tools = {
  placeSearch: convertToVercelAiTool({
    ...placeSearch,
    context: { getFsqToken: () => process.env.FSQ_TOKEN! },
  }),
  geoTagging: convertToVercelAiTool({
    ...geoTagging,
    context: { getFsqToken: () => process.env.FSQ_TOKEN! },
  }),
  webSearch: convertToVercelAiTool({
    ...webSearch,
    context: { getSearchAPIKey: () => process.env.SEARCH_API_KEY! },
  }),
};
```

## Tool map

- `placeSearch` (Foursquare): Search places by query + `near` or lat/lon (+ optional filters like categories, open_now, price). Returns GeoJSON and a generated dataset name.
- `geoTagging` (Foursquare): Given a coordinate, return nearby place context / enrichment.
- `webSearch` (SearchAPI): Google-style web search returning structured results (requires `context.getSearchAPIKey()`).

## Notes

- Use `placeSearch` when you want mappable POIs (GeoJSON); use `webSearch` when you want links/snippets and “what is X?” style retrieval.
- Both `placeSearch` and `geoTagging` require an API token via `context.getFsqToken()`.

