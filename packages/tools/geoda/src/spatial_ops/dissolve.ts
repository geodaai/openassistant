// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { extendedTool, generateId } from '@openassistant/utils';
import { z } from 'zod';
import { spatialDissolve } from '@geoda/core';
import { Feature, Geometry } from 'geojson';

import { isSpatialToolContext } from '../utils';
import { SpatialToolContext } from '../types';
import { applyJoin } from '../spatial_join/apply-join';

export type DissolveFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
  dissolveBy: z.ZodOptional<z.ZodString>;
  aggregateVariables: z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        variableName: z.ZodString;
        operator: z.ZodEnum<
          ['sum', 'mean', 'min', 'max', 'median', 'count', 'unique']
        >;
      }>
    >
  >;
}>;

export type DissolveLlmResult = {
  success: boolean;
  datasetName: string;
  result: string;
};

export type DissolveAdditionalData = {
  datasetName?: string;
  geojson?: string;
  dissolved: Feature<Geometry, GeoJSON.GeoJsonProperties>;
};

/**
 * ## dissolve Tool
 *
 * This tool is used to merge multiple geometries into a single geometry.
 *
 * ### Dissolve Function
 *
 * The tool supports:
 * - Dissolving geometries from GeoJSON input
 * - Dissolving geometries from a dataset
 * - Returns a single merged geometry that can be used for mapping
 *
 * When user prompts e.g. *can you merge these counties into a single region?*
 *
 * 1. The LLM will execute the callback function of dissolveFunctionDefinition, and merge the geometries using the data retrieved from `getGeometries` function.
 * 2. The result will include the merged geometry and a new dataset name for mapping.
 * 3. The LLM will respond with the dissolve results and the new dataset name.
 *
 * ### For example
 * ```
 * User: can you merge these counties into a single region?
 * ```
 *
 * ### Code example
 * ```typescript
 * import { dissolve, DissolveTool } from '@openassistant/geoda';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const dissolveTool: DissolveTool = {
 *   ...dissolve,
 *   context: {
 *     getGeometries: (datasetName) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *     },
 *   },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     console.log(toolCallId, additionalData);
 *     // do something like save the dissolve result in additionalData
 *   },
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you merge these counties into a single region?',
 *   tools: {dissolve: convertToVercelAiTool(dissolveTool)},
 * });
 * ```
 */
export const dissolve = extendedTool<
  DissolveFunctionArgs,
  DissolveLlmResult,
  DissolveAdditionalData,
  SpatialToolContext
>({
  description: `Dissolve geometries by merging neighboring geometries into a single geometry.`,
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to be dissolved. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe('Name of the dataset with geometries to be dissolved'),
    dissolveBy: z.string().optional().describe(`The variable to dissolve by.
For example, when dissolving a county dataset into a state dataset, the dissolveBy could be the state name or the state code.
If not provided, the entire dataset will be dissolved.
`),
    aggregateVariables: z
      .array(
        z.object({
          variableName: z.string(),
          operator: z.enum([
            'sum',
            'mean',
            'min',
            'max',
            'median',
            'count',
            'unique',
          ]),
        })
      )
      .optional(),
  }),
  execute: async (args, options) => {
    const { datasetName, geojson, dissolveBy, aggregateVariables } = args;
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }
    const { getGeometries, getValues } = options.context;

    let geometries;

    if (geojson) {
      const geojsonObject = JSON.parse(geojson);
      geometries = geojsonObject.features;
    } else if (datasetName && getGeometries) {
      geometries = await getGeometries(datasetName);
    }

    if (!geometries) {
      throw new Error('No geometries found');
    }

    const dissolvedPolygons: Feature[] = [];
    const dissolvedGroups: number[][] = [];

    // dissolve the geometries by the dissolveBy variable
    if (dissolveBy && datasetName && getValues) {
      // get the values of the dissolveBy variable
      const dissolveByValues = await getValues(datasetName, dissolveBy);
      // find unique values of dissolveBy values
      const uniqueDissolveByValues = [...new Set(dissolveByValues)];
      // dissolve the geometries by the unique dissolveBy values
      for (const value of uniqueDissolveByValues) {
        const ids: number[] = [];
        const dissolvedGroup = geometries.filter((geometry, index) => {
          if (geometry.properties[dissolveBy] === value) {
            ids.push(index);
          }
          return geometry.properties[dissolveBy] === value;
        });
        const dissolvedPolygon = await spatialDissolve(dissolvedGroup);
        dissolvedPolygons.push(dissolvedPolygon);
        dissolvedGroups.push(ids);
      }
    } else {
      // dissolve the geometries by the entire dataset
      const dissolvedPolygon = await spatialDissolve(geometries);
      dissolvedPolygons.push(dissolvedPolygon);
      // get all ids
      const ids = geometries.map((_, index) => index);
      dissolvedGroups.push(ids);
    }

    // try to apply dissolveVariableOperators to the dissolved groups
    const joinValues: Record<string, (number | string)[]> = {};

    if (datasetName && aggregateVariables && getValues) {
      await Promise.all(
        aggregateVariables.map(async ({ variableName, operator }) => {
          const values = await getValues(datasetName, variableName);
          try {
            const joinedValues = dissolvedGroups.map((group) => {
              return applyJoin(
                operator,
                group.map((index) => values[index]) as number[]
              );
            });
            joinValues[variableName] = joinedValues;
          } catch (error) {
            throw new Error(
              `Error applying join operator to variable ${variableName}: ${error}`
            );
          }
        })
      );
      // add joinValues to the dissolvedPolygons in properties
      dissolvedPolygons.forEach((polygon, index) => {
        polygon.properties = {
          ...polygon.properties,
          // add joinValues to the dissolvedPolygons in properties
          ...Object.fromEntries(
            Object.entries(joinValues).map(([key, value]) => [
              key,
              value[index],
            ])
          ),
        };
      });
    }

    // create a unique id for the dissolve result
    const outputDatasetName = `dissolve_${generateId()}`;
    const outputGeojson = {
      type: 'FeatureCollection',
      features: dissolvedPolygons,
    };

    return {
      llmResult: {
        success: true,
        result: `Geometries dissolved successfully, and it has been saved in dataset: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName: outputDatasetName,
        [outputDatasetName]: {
          type: 'geojson',
          content: outputGeojson,
        },
      },
    };
  },
  context: {
    getGeometries: async () => null,
  },
});

export type DissolveTool = typeof dissolve;
