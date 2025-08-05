// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { getTool, OnToolCompleted } from '@openassistant/utils';
import { placeSearch } from './placeSearch';
import { geotagging } from './geoTagging';
import { webSearch } from './webSearch';

// export the enum of tool names, so users can use it to check if a tool is available
export enum PlacesToolNames {
  placeSearch = 'placeSearch',
  geotagging = 'geotagging',
  webSearch = 'webSearch',
}

export type FoursquareToolContext = {
  getFsqToken: () => string;
  getGeometries?: (datasetName: string) => Promise<GeoJSON.Feature[] | null>;
};

export type SearchAPIToolContext = {
  getSearchAPIKey: () => string;
};

export function isFoursquareToolContext(
  context: unknown
): context is FoursquareToolContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getFsqToken' in context
  );
}

export function isSearchAPIToolContext(
  context: unknown
): context is SearchAPIToolContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getSearchAPIKey' in context
  );
}

export function registerTools() {
  return {
    placeSearch,
    geotagging,
    webSearch,
  };
}

/**
 * Get a single Places tool.
 *
 * @example
 * ```typescript
 * import { getPlacesTool, PlacesToolNames } from '@openassistant/places';
 *
 * const placeSearchTool = getPlacesTool(PlacesToolNames.placeSearch, {
 *   toolContext: {
 *     getFsqToken: () => 'your-foursquare-token',
 *   },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     // you can get the place search result from the additional data
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
 *     placeSearch: placeSearchTool,
 *   },
 * });
 * ```
 *
 * @param toolName - The name of the tool to get
 * @param options - The options for the tool
 * @returns The tool
 */
export function getPlacesTool(
  /** The name of the tool to get */
  toolName: string,
  /** The options for the tool */
  options?: {
    /** The tool context, which is required for all places tools */
    toolContext?: FoursquareToolContext;
    /** The callback function to handle the tool completion and get the output data from the tool call */
    onToolCompleted?: OnToolCompleted;
    /** Whether the tool is executable e.g. on the server side, default to true. If false, you need to execute the tool on the client side. */
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
 * Get all Places tools.
 *
 * @param toolContext - The tool context, which is required for all places tools
 * @param onToolCompleted - The callback function to handle the tool completion and get the output data from the tool call
 * @param isExecutable - Whether the tool is executable e.g. on the server side, default to true. If false, you need to execute the tool on the client side.
 * @returns The tools
 */
export function getPlacesTools(
  toolContext: FoursquareToolContext,
  onToolCompleted: OnToolCompleted,
  isExecutable: boolean = true
) {
  const tools = registerTools();

  const toolsResult = Object.fromEntries(
    Object.keys(tools).map((key) => {
      return [
        key,
        getPlacesTool(key, { toolContext, onToolCompleted, isExecutable }),
      ];
    })
  );

  return toolsResult;
} 