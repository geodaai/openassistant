import { getTool, OnToolCompleted } from '@openassistant/utils';
import { getUsStateGeojson } from './us/state';
import { getUsCountyGeojson } from './us/county';
import { getUsZipcodeGeojson } from './us/zipcode';
import { queryUSZipcodes } from './us/queryZipcode';
import { geocoding } from './geocoding';
import { routing } from './routing';
import { isochrone } from './isochrone';

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

export function getVercelAiTool(
  toolName: string,
  toolContext: OsmToolContext,
  onToolCompleted: OnToolCompleted
) {
  const tool = registerTools()[toolName];
  if (!tool) {
    throw new Error(`Tool "${toolName}" not found`);
  }
  return getTool(tool, toolContext, onToolCompleted);
}

export function getVercelTools(
  toolContext: OsmToolContext,
  onToolCompleted: OnToolCompleted
) {
  const tools = registerTools();
  return Object.keys(tools).map((key) => {
    return getVercelAiTool(key, toolContext, onToolCompleted);
  });
}
