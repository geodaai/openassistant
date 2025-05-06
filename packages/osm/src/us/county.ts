import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { cacheData, generateId, getCachedData } from '../utils';

export type GetUsCountyGeojsonFunctionArgs = z.ZodObject<{
  fipsCodes: z.ZodArray<z.ZodString>;
}>;

export type GetUsCountyGeojsonLlmResult = {
  success: boolean;
  result?: string;
  datasetId?: string;
  error?: string;
};

export type GetUsCountyGeojsonAdditionalData = {
  fipsCodes: string[];
  geojson: GeoJSON.FeatureCollection;
  datasetId: string;
};

export type ExecuteGetUsCountyGeojsonResult = {
  llmResult: GetUsCountyGeojsonLlmResult;
  additionalData?: GetUsCountyGeojsonAdditionalData;
};

/**
 * Get US County GeoJSON Tool
 *
 * This tool retrieves the GeoJSON data for all counties in a US state by its state code.
 * It returns the counties' boundary geometries and properties.
 *
 * Example user prompts:
 * - "Get all counties in California"
 * - "Show me the county boundaries of New York state"
 * - "What are the counties in Texas?"
 *
 * Example code:
 * ```typescript
 * import { getVercelAiTool } from "@openassistant/osm";
 *
 * const countyTool = getVercelAiTool('getUsCountyGeojson');
 *
 * generateText({
 *   model: 'gpt-4o-mini',
 *   prompt: 'What are the counties in Texas?',
 *   tools: {getUsCountyGeojson: countyTool},
 * });
 * ```
 */
export const getUsCountyGeojson = tool<
  GetUsCountyGeojsonFunctionArgs,
  GetUsCountyGeojsonLlmResult,
  GetUsCountyGeojsonAdditionalData,
  object
>({
  description:
    'Get GeoJSON data for all counties in a US state by its state code',
  parameters: z.object({
    fipsCodes: z.array(
      z
        .string()
        .describe(
          'The 5-digit FIPS code of a United States county (e.g., 01001 for Autauga County, Alabama)'
        )
    ),
  }),
  execute: async (args): Promise<ExecuteGetUsCountyGeojsonResult> => {
    try {
      const { fipsCodes } = args;
      const features: GeoJSON.Feature[] = [];

      for (const fips of fipsCodes) {
        let geojson = getCachedData(fips);
        if (!geojson) {
          const stateCode = fips.substring(0, 2);
          const response = await fetch(
            `https://raw.githubusercontent.com/hyperknot/country-levels-export/master/geojson/medium/fips/${stateCode}/${fips}.geojson`
          );

          // the above url return Feature directly, not FeatureCollection
          geojson = await response.json();
          if (geojson) {
            cacheData(fips, geojson);
          }
        }
      }

      const finalGeojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features,
      };

      const datasetId = generateId();

      cacheData(datasetId, finalGeojson);

      return {
        llmResult: {
          success: true,
          datasetId,
          result: `Successfully fetched the GeoJSON data of the counties. The GeoJSON data has been cached with the id ${datasetId}.`,
        },
        additionalData: {
          fipsCodes,
          geojson: finalGeojson,
          datasetId,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: `Failed to get the GeoJSON data of the county ${args}: ${error}`,
        },
      };
    }
  },
});

export type GetUsCountyGeojsonTool = typeof getUsCountyGeojson;
