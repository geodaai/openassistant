# Function: getOsmTool()

> **getOsmTool**(`toolName`, `options`?): `ToolResult`

Defined in: [packages/osm/src/register-tools.ts:82](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/osm/src/register-tools.ts#L82)

Get a single OSM tool.

## Parameters

### toolName

`string`

The name of the tool to get

### options?

The options for the tool

#### isExecutable?

`boolean`

Whether the too is executable e.g. on the server side, default to true. If false, you need to execute the tool on the client side.

#### onToolCompleted?

`OnToolCompleted`

The callback function to handle the tool completion and get the output data from the tool call

#### toolContext?

[`OsmToolContext`](../type-aliases/OsmToolContext.md)

The tool context, which is required for some tools e.g. routing, isochrone, etc.

## Returns

`ToolResult`

The tool

## Example

```typescript
import { getOsmTool, OsmToolNames } from '@openassistant/osm';

// for geocoding, no context needed
const geocodingTool = getOsmTool(OsmToolNames.geocoding);

// for routing, you need to provide a tool context
const routingTool = getOsmTool(OsmToolNames.routing, {
  toolContext: {
    getMapboxToken: () => 'your-mapbox-token',
  },
  onToolCompleted: (toolCallId, additionalData) => {
    // you can get the route result from the additional data
    console.log(toolCallId, additionalData);
  },
});

// use the tool in a chat
streamText({
  model: openai('gpt-4o'),
  messages: messages,
  system: systemPrompt,
  tools: {
    geocoding: geocodingTool,
    routing: routingTool,
  },
});
```
