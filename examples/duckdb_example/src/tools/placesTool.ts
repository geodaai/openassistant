import { z } from 'zod';
import { MutableRefObject } from 'react';
import { splitSqlStatements } from '@sqlrooms/duckdb';

export function createGetPlacesTool(storeRef: MutableRefObject<any>) {
  return {
    name: 'getPlaces',
    description: `Retrieve the places data (like parks, schools, hospitals, etc.) in a specific area.
- When you have specific bounding box (latitude/longitude coordinates), use the following SQL query template:

---sql start---
LOAD httpfs;
LOAD spatial;
SET s3_region='us-west-2';
SELECT
  id,
  names.primary as name,
  confidence AS confidence,
  CAST(socials AS JSON) as socials,
  geometry AS geom
FROM
  read_parquet('s3://overturemaps-us-west-2/release/2025-11-19.0/theme=places/type=place/*', filename=true, hive_partitioning=1)
WHERE
  categories.primary = 'pizza_restaurant'
  AND bbox.xmin BETWEEN -75 AND -73       -- Only use the bbox min values
  AND bbox.ymin BETWEEN 40 AND 41         -- because they are point geometries.
---sql end---
`,
    parameters: z.object({
      sqlQuery: z
        .string()
        .describe(
          'The SQL query to execute for fetching places within a specific bounding box.'
        ),
      reasoning: z
        .string()
        .optional()
        .describe('Explanation of the query logic.'),
      tableName: z.string().describe('Unique output table name for places.'),
    }),
    execute: async (
      {
        sqlQuery,
        tableName,
      }: { sqlQuery: string; reasoning?: string; tableName: string },
      options?: { abortSignal?: AbortSignal }
    ) => {
      if (!storeRef.current) {
        throw new Error('Store is not yet initialized');
      }

      const store = storeRef.current;
      const abortSignal = options?.abortSignal;

      try {
        // Get the DuckDB connector
        const connector = await store.getState().db.getConnector();
        if (!connector) {
          throw new Error('DuckDB connector is not initialized');
        }

        const statements = splitSqlStatements(sqlQuery);
        // find the SELECT statement
        const selectStatement = statements.find((statement) =>
          statement.startsWith('SELECT')
        );
        if (selectStatement) {
          // wrap the SELECT statement with CREATE OR REPLACE TABLE <tableName> AS (SELECT statement)
          const wrappedStatement = `CREATE OR REPLACE TABLE ${tableName} AS (${selectStatement})`;
          // replace the SELECT statement with the wrapped statement
          statements[statements.indexOf(selectStatement)] = wrappedStatement;
        }
        // join the statements back together
        const finalStatement = statements.join(';');
        // execute the final statement
        await connector.query(finalStatement, {
          signal: abortSignal,
        });

        // Sync with kepler.gl and add to map
        const kepler = store.getState().kepler;
        if (kepler) {
          await kepler.syncKeplerDatasets();
          const currentMapId = kepler.getCurrentMap()?.id || '';
          if (currentMapId) {
            await kepler.addTableToMap(currentMapId, tableName);
          }
        }

        return {
          llmResult: {
            success: true,
            details: `Successfully fetched places. The places are stored in table "${tableName}".`,
          },
        };
      } catch (error) {
        console.error('Failed to fetch places', error);
        return {
          llmResult: {
            success: false,
            details: 'Failed to fetch places.',
            errorMessage:
              error instanceof Error ? error.message : 'Unknown error',
          },
        };
      }
    },
  };
}
