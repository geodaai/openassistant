import { extendedTool, generateId } from '@openassistant/utils';
import { z } from 'zod';

export const downloadMapData = extendedTool({
  description: 'Download map data from a url',
  parameters: z.object({
    url: z.string(),
  }),
  execute: async (args) => {
    const { url } = args;
    try {
      // download the url, which could be
      // - a geojson file
      // - a csv file

      const rawData = await fetch(url);

      let data;
      let fields;

      const contentType = rawData.headers.get('content-type');
      if (contentType?.includes('json')) {
        data = await rawData.json();
        // get the fields from the geojson file
        fields = Object.keys(data.features[0].properties);
      }

      if (!data) {
        throw new Error('Unsupported file type, only geojson is supported.');
      }

      // create a unique datasetName
      const datasetName = `map-data-${generateId()}`;

      return {
        llmResult: {
          success: true,
          datasetName,
          fields,
          result: `Successfully downloaded map data from ${url} as datasetName: ${datasetName}`,
          instructions: `Please remember this datasetName ${datasetName} and its fields for later use.`,
        },
        additionalData: {
          datasetName,
          [datasetName]: data,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        llmResult: {
          success: false,
          error: `Failed to download map data from ${url}: ${error}`,
        },
      };
    }
  },
  context: {},
});
