import { tool, generateId } from '@openassistant/utils';
import { z } from 'zod';

export const downloadMapData = tool({
  description: 'Download map data',
  parameters: z.object({
    url: z.string(),
  }),
  execute: async (args, options) => {
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
      } else if (contentType?.includes('csv')) {
        data = await rawData.text();
        // parse the csv data into an array of objects, first line is the header
        const rows = data.split('\n');
        fields = rows[0].split(',');
        data = rows.slice(1).map((row) => row.split(','));
      }

      if (!data) {
        throw new Error('Unsupported file type');
      }

      // create a unique datasetName
      const datasetName = `map-data-${generateId()}`;

      return {
        llmResult: {
          success: true,
          datasetName,
          fields,
          result: `Successfully downloaded map data from ${url} as datasetName: ${datasetName}`,
        },
        additionalData: {
          datasetName,
          [datasetName]: data,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: `Failed to download map data from ${url}: ${error}`,
        },
      };
    }
  },
});
