import { tool } from "@openassistant/utils";
import { z } from "zod";
import L from 'leaflet';

export type LeafletToolLlmResult = {
  success: boolean;
  error?: string;
  details?: string;
};

export type LeafletToolAdditionalData = {
  datasetName: string;
  colorBy: string;
  colorType: 'breaks' | 'unique';
  breaks?: number[];
  colors?: string[];
  defaultColor?: string;
  valueColorMap?: Record<string | number, string>;
};

export const leaflet = tool({
  description: 'Create a leaflet map from GeoJSON data',
  parameters: z.object({
    datasetName: z.string().describe('The name of the dataset to visualize'),
    colorBy: z.string().describe('The column name to use for coloring features'),
    colorType: z.enum(['breaks', 'unique']).describe('Type of coloring: breaks for continuous values, unique for categorical values'),
    breaks: z.array(z.number()).optional().describe('Break points for continuous values (e.g. [50000, 70000])'),
    colors: z.array(z.string()).optional().describe('Colors to use for breaks or unique values'),
    defaultColor: z.string().optional().describe('Default color for features that dont match any break or unique value'),
    valueColorMap: z.record(z.string(), z.string()).optional().describe('Explicit mapping of values to colors for unique value coloring (e.g. {"high": "#1a9850", "medium": "#fee08b", "low": "#d73027"})'),
  }),
  execute: async ({ datasetName, colorBy, colorType, breaks, colors, defaultColor, valueColorMap }) => {
    try {
      const map = L.map('map').setView([51.505, -0.09], 13);
      
      // Function to get color based on value and coloring type
      const getColor = (value) => {
        if (colorType === 'breaks' && breaks && colors) {
          // Handle continuous values with breaks
          for (let i = 0; i < breaks.length; i++) {
            if (value <= breaks[i]) {
              return colors[i];
            }
          }
          return colors[colors.length - 1];
        } else if (colorType === 'unique') {
          if (valueColorMap) {
            // Use explicit value-to-color mapping if provided
            return valueColorMap[value] || defaultColor || '#3388ff';
          } else if (colors) {
            // Fallback to cycling through colors if no mapping provided
            const index = Math.abs(String(value).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
            return colors[index];
          }
        }
        return defaultColor || '#3388ff';
      };

      // TODO: Add GeoJSON layer with styling based on getColor function
      
      return {
        llmResult: {
          success: true,
          details: 'Map created successfully'
        },
        additionalData: {
          datasetName,
          colorBy,
          colorType,
          breaks,
          colors,
          defaultColor,
          valueColorMap
        }
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }
      };
    }
  },
});
