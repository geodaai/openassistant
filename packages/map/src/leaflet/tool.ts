import { tool } from '@openassistant/utils';
import { z } from 'zod';

import { isMapToolContext, MapToolContext } from '../register-tools';

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
};

export type LeafletToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  colorBy: z.ZodOptional<z.ZodString>;
  colorType: z.ZodOptional<z.ZodEnum<['breaks', 'unique']>>;
  breaks: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
  colors: z.ZodOptional<z.ZodArray<z.ZodString>>;
  valueColorMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}>;

/**
 * Get bounds from GeoJSON data that encompasses all geometries
 * @param geoJsonData GeoJSON FeatureCollection or Feature
 * @returns [[minLat, minLng], [maxLat, maxLng]] bounds that encompasses all geometries
 */
function getBoundsFromGeoJSON(
  geoJsonData: GeoJSON.FeatureCollection | GeoJSON.Feature
): [[number, number], [number, number]] {
  let minLat = 90;
  let minLng = 180;
  let maxLat = -90;
  let maxLng = -180;

  const processCoordinates = (coordinates: number[][]) => {
    coordinates.forEach(([lng, lat]) => {
      minLat = Math.min(minLat, lat);
      minLng = Math.min(minLng, lng);
      maxLat = Math.max(maxLat, lat);
      maxLng = Math.max(maxLng, lng);
    });
  };

  const processGeometry = (geometry: GeoJSON.Geometry) => {
    switch (geometry.type) {
      case 'Point':
        const [lng, lat] = geometry.coordinates;
        minLat = Math.min(minLat, lat);
        minLng = Math.min(minLng, lng);
        maxLat = Math.max(maxLat, lat);
        maxLng = Math.max(maxLng, lng);
        break;
      case 'MultiPoint':
        processCoordinates(geometry.coordinates);
        break;
      case 'LineString':
        processCoordinates(geometry.coordinates);
        break;
      case 'MultiLineString':
        geometry.coordinates.forEach(processCoordinates);
        break;
      case 'Polygon':
        geometry.coordinates.forEach(processCoordinates);
        break;
      case 'MultiPolygon':
        geometry.coordinates.forEach((polygon) => {
          polygon.forEach(processCoordinates);
        });
        break;
    }
  };

  if ('features' in geoJsonData) {
    // FeatureCollection
    geoJsonData.features.forEach((feature) => {
      processGeometry(feature.geometry);
    });
  } else {
    // Single Feature
    processGeometry(geoJsonData.geometry);
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}

export const leaflet = tool<
  LeafletToolArgs,
  LeafletToolLlmResult,
  LeafletToolAdditionalData,
  MapToolContext
>({
  description: `Create a leaflet map from GeoJSON data. For basic map visualization, you can omit color related parameters.`,
  parameters: z.object({
    datasetName: z.string(),
    colorBy: z.string().optional(),
    colorType: z.enum(['breaks', 'unique']).optional(),
    breaks: z.array(z.number()).optional(),
    colors: z.array(z.string()).optional(),
    valueColorMap: z
      .record(z.string(), z.string())
      .optional()
      .describe(
        'Explicit mapping of values to colors for unique value coloring (e.g. {"high": "#1a9850", "medium": "#fee08b", "low": "#d73027"}) when colorBy is provided.'
      ),
  }),
  execute: async (
    { datasetName, colorBy, colorType, breaks, colors, valueColorMap },
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
      const mapBounds = getBoundsFromGeoJSON(geoJsonData);

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
          valueColorMap,
          geoJsonData,
          mapBounds,
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
