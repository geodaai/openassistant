import { tool } from '@openassistant/core';
import { z } from 'zod';

// global variable to cache the GeoJSON data of a United States state
const stateGeojsonCache = new Map<string, GeoJSON.FeatureCollection>();

export const getUsStateGeojson = tool<
  z.ZodObject<{
    state: z.ZodString;
  }>,
  ExecuteGetUsStateGeojsonResult['llmResult'],
  ExecuteGetUsStateGeojsonResult['additionalData']
>({
  description: 'Get the GeoJSON data of a United States state',
  parameters: z.object({
    state: z
      .string()
      .describe('The two-letter postal abbreviations of a state'),
  }),
  execute: async (args) => {
    const state = args.state;

    if (stateGeojsonCache.has(state)) {
      const geojson = stateGeojsonCache.get(state);
      return {
        llmResult: {
          success: true,
          result: `Successfully fetched the GeoJSON data of the state ${state}`,
        },
        additionalData: { state, geojson },
      };
    }

    // get the Geojson file from the following url:
    // https://www.ncei.noaa.gov/pub/data/nidis/geojson/state/geostates/AK.geojson
    const response = await fetch(
      `https://www.ncei.noaa.gov/pub/data/nidis/geojson/state/geostates/${state}.geojson`
    );
    const geojson = await response.json();
    stateGeojsonCache.set(state, geojson);

    return {
      llmResult: {
        success: true,
        result: `Successfully fetched the GeoJSON data of the state ${state}`,
      },
      additionalData: { state, geojson },
    };
  },
});

export type GetUsStateGeojsonTool = typeof getUsStateGeojson;

export type ExecuteGetUsStateGeojsonResult = {
  llmResult: {
    success: boolean;
    result?: {
      state: string;
    };
    error?: string;
  };
  additionalData?: {
    state: string;
    geojson: GeoJSON.FeatureCollection;
  };
};

export function getCachedUsStates(state: string) {
  return stateGeojsonCache.get(state);
}
