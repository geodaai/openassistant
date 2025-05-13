import { getTool, OnToolCompleted } from '@openassistant/utils';
import { getUsStateGeojson } from './us/state';
import { getUsCountyGeojson } from './us/county';
import { getUsZipcodeGeojson } from './us/zipcode';
import { queryUSZipcodes } from './us/queryZipcode';
import { geocoding } from './geocoding';
import { routing } from './routing';
import { isochrone } from './isochrone';

// export the enum of tool names, so users can use it to check if a tool is available
export enum OsmToolNames {
  getUsStateGeojson = 'getUsStateGeojson',
  getUsCountyGeojson = 'getUsCountyGeojson',
  getUsZipcodeGeojson = 'getUsZipcodeGeojson',
  queryUSZipcodes = 'queryUSZipcodes',
  geocoding = 'geocoding',
  routing = 'routing',
  isochrone = 'isochrone',
}

export type OsmToolContext = {
  getMapboxToken: () => string;
};

export function isOsmToolContext(context: unknown): context is OsmToolContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getMapboxToken' in context
  );
}

export function registerTools() {
  return {
    getUsStateGeojson,
    getUsCountyGeojson,
    getUsZipcodeGeojson,
    queryUSZipcodes,
    geocoding,
    routing,
    isochrone,
  };
}

/**
 * Get a single OSM tool.
 *
 * @example
 * ```typescript
 * import { getOsmTool, OsmToolNames } from '@openassistant/osm';
 *
 * // for geocoding, no context needed
 * const geocodingTool = getOsmTool(OsmToolNames.geocoding);
 *
 * // for routing, you need to provide a tool context
 * const routingTool = getOsmTool(OsmToolNames.routing, {
 *   toolContext: {
 *     getMapboxToken: () => 'your-mapbox-token',
 *   },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     // you can get the route result from the additional data
 *     console.log(toolCallId, additionalData);
 *   },
 * });
 *
 * // use the tool in a chat
 * streamText({
 *   model: openai('gpt-4o'),
 *   messages: messages,
 *   system: systemPrompt,
 *   tools: {
 *     geocoding: geocodingTool,
 *     routing: routingTool,
 *   },
 * });
 * ```
 *
 * @param toolName - The name of the tool to get
 * @param options - The options for the tool
 * @returns The tool
 */
export function getOsmTool(
  /** The name of the tool to get */
  toolName: string,
  /** The options for the tool */
  options?: {
    /** The tool context, which is required for some tools e.g. routing, isochrone, etc. */
    toolContext?: OsmToolContext;
    /** The callback function to handle the tool completion and get the output data from the tool call */
    onToolCompleted?: OnToolCompleted;
    /** Whether the too is executable e.g. on the server side, default to true. If false, you need to execute the tool on the client side. */
    isExecutable?: boolean;
  }
) {
  const tool = registerTools()[toolName];
  if (!tool) {
    throw new Error(`Tool "${toolName}" not found`);
  }
  return getTool({
    tool,
    options: {
      ...options,
      isExecutable: options?.isExecutable ?? true,
    },
  });
}

/**
 * Get all OSM tools.
 *
 * @param toolContext - The tool context, which is required for some tools e.g. routing, isochrone, etc.
 * @param onToolCompleted - The callback function to handle the tool completion and get the output data from the tool call
 * @param isExecutable - Whether the tool is executable e.g. on the server side, default to true. If false, you need to execute the tool on the client side.
 * @returns The tools
 */
export function getOsmTools(
  toolContext: OsmToolContext,
  onToolCompleted: OnToolCompleted,
  isExecutable: boolean = true
) {
  const tools = registerTools();

  const toolsResult = Object.fromEntries(
    Object.keys(tools).map((key) => {
      return [
        key,
        getOsmTool(key, { toolContext, onToolCompleted, isExecutable }),
      ];
    })
  );

  return toolsResult;
}
