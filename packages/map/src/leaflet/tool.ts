import { tool } from '@openassistant/utils';
import { z } from 'zod';

import { isMapToolContext, MapToolContext } from '../register-tools';
import { getBoundsFromGeoJSON } from '../utils';

export type LeafletToolLlmResult = {
  success: boolean;
  error?: string;
  details?: string;
};

export type LeafletToolAdditionalData = {
  datasetName: string;
  colorBy?: string;
  colorType?: 'breaks' | 'unique';
  breaks?: number[];
  colors?: string[];
  valueColorMap?: Record<string | number, string>;
  geoJsonData: GeoJSON.FeatureCollection;
  mapBounds: [[number, number], [number, number]];
  zoom: number;
};

export type LeafletToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  colorBy: z.ZodOptional<z.ZodString>;
  colorType: z.ZodOptional<z.ZodEnum<['breaks', 'unique']>>;
  breaks: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
  uniqueValues: z.ZodOptional<
    z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>>
  >;
  colors: z.ZodOptional<z.ZodArray<z.ZodString>>;
}>;

export const leaflet = tool<
  LeafletToolArgs,
  LeafletToolLlmResult,
  LeafletToolAdditionalData,
  MapToolContext
>({
  description: `Create a leaflet map from GeoJSON data. For basic map visualization, you can omit color related parameters.
- When creating a map for a variable, please use dataClassify tool to classify the data into bins or unique values first.
- Colors are required when colorBy is provided (e.g. ['#f7fcb9', '#addd8e', '#31a354'].
- For colorType 'breaks', the number of colors must equal to the number of breaks + 1.
- For colorType 'unique', the number of colors must equal to the number of unique values. Please try to use colorbrewer divergent colors (e.g. BrBG).
- Please use colorBrewer colors (e.g. YlGn) if user does not provide colors.
`,
  parameters: z.object({
    datasetName: z.string(),
    colorBy: z.string().optional(),
    colorType: z.enum(['breaks', 'unique']).optional(),
    breaks: z.array(z.number()).optional(),
    uniqueValues: z.array(z.union([z.string(), z.number()])).optional(),
    colors: z.array(z.string()).optional(),
  }),
  execute: async (
    { datasetName, colorBy, colorType, breaks, uniqueValues, colors },
    options
  ) => {
    try {
      const context = options?.context;
      if (!isMapToolContext(context)) {
        throw new Error('Tool context is required');
      }
      const { getGeometries, getDataset } = context;

      let dataContent;

      if (getDataset) {
        dataContent = await getDataset(datasetName);
      }

      if (!dataContent && getGeometries) {
        // get dataContent from previous tool call
        dataContent = await getGeometries(datasetName);
      }

      if (!dataContent) {
        throw new Error(
          'getDataset() or getGeometries() of CreateMapTool is not implemented'
        );
      }

      // check if dataContent is GeoJSON
      if (
        dataContent.type !== 'FeatureCollection' &&
        dataContent.type !== 'Feature'
      ) {
        // check if dataContent is an array of GeoJSON features
        if (
          Array.isArray(dataContent) &&
          dataContent.every((feature) => feature.type === 'Feature')
        ) {
          dataContent = {
            type: 'FeatureCollection',
            features: dataContent,
          };
        } else {
          throw new Error('Data is not GeoJSON');
        }
      }

      const geoJsonData = dataContent as GeoJSON.FeatureCollection;

      // get mapBounds (LatLngTuple for southWest and northEast) from geoJsonData
      const { bounds, zoom } = getBoundsFromGeoJSON(geoJsonData);

      // TODO: Add GeoJSON layer with styling based on getColor function

      return {
        llmResult: {
          success: true,
          details: 'Map created successfully',
        },
        additionalData: {
          datasetName,
          colorBy,
          colorType,
          breaks,
          colors,
          uniqueValues,
          geoJsonData,
          mapBounds: bounds,
          zoom,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },
});
