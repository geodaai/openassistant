# Function: getMapTool()

> **getMapTool**(`toolName`, `options`): `ToolResult`

Defined in: [packages/map/src/register-tools.ts:108](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/map/src/register-tools.ts#L108)

Get a map tool (client-side tool)

:::note
This tool is executed in the browser. You can use it to create a map in the browser.
:::

To create a map, this tool will get the dataset or geometries from the tool context.
You will need to provide the tool context to the tool.

## Parameters

### toolName

`string`

The name of the tool to get

### options

The options for the tool

#### isExecutable?

`boolean`

#### onToolCompleted?

`OnToolCompleted`

#### toolContext

[`KeplerglToolContext`](../type-aliases/KeplerglToolContext.md)

## Returns

`ToolResult`

The tool

## Examples

```typescript
import { getMapTool, MapToolNames } from '@openassistant/map';

const keplerglTool = getMapTool(MapToolNames.keplergl, {
  toolContext: {
    getDataset: async (datasetName: string) => {
      // get the dataset for mapping, e.g. geojson dataset, csv, geoarrow etc.
      return {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [102.0, 0.5],
              },
            },
          ],
        };
    },
  },
});

streamText({
  model: openai('gpt-4o'),
  prompt: 'Create a map of the dataset XYZ',
  tools: {
    keplergl: keplerglTool,
  },
});
```

You can also pass geometries that are genereted from other tools e.g. isochrone or routing.

```typescript
import { getOsmTool, OsmToolNames } from '@openassistant/osm';
import { getMapTool, MapToolNames } from '@openassistant/map';

const dataCache = {};

const geocodingTool = getOsmTool(OsmToolNames.geocoding);

const isochroneTool = getOsmTool(OsmToolNames.isochrone, {
  toolContext: {
    getMapboxToken: async () => {
      return process.env.MAPBOX_TOKEN;
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    const {cacheId, isochrone} = additionalData;
    if (cacheId && isochrone) {
      dataCache[cacheId] = isochrone;
    }
  },
});

const keplerglTool = getMapTool(MapToolNames.keplergl, {
  toolContext: {
    getGeometries: async (datasetName: string) => {
      if (dataCache[datasetName]) {
        return dataCache[datasetName];
      }
      throw new Error(`geometries of ${datasetName} not found`);
    },
  },
});

streamText({
  model: openai('gpt-4o'),
  prompt: 'Create a map of 5 minutes isochrone of the Eiffel Tower',
  tools: {
    geocoding: geocodingTool,
    isochrone: isochroneTool,
    keplergl: keplerglTool,
  },
});
```
