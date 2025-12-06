import { z } from 'zod';
import { MutableRefObject } from 'react';
import { splitSqlStatements } from '@sqlrooms/duckdb';

export function createGetBuildingTool(storeRef: MutableRefObject<any>) {
  return {
    name: 'getBuildings',
    description: `Retrieve the buildings data in a specific area.
- When you have specific bounding box (latitude/longitude coordinates), use the following SQL query template:

---sql start---
LOAD httpfs;
LOAD spatial;
SET s3_region='us-west-2';
SELECT
  id,
  names.primary as name,
  height,
  geometry AS geom
FROM
  read_parquet('s3://overturemaps-us-west-2/release/2025-11-19.0/theme=buildings/type=building/*.parquet', filename=true, hive_partitioning=1)
WHERE
  names.primary IS NOT NULL
  AND bbox.xmin BETWEEN -84.36 AND -82.42
  AND bbox.ymin BETWEEN 41.71 AND 43.33
---sql end---
`,
    parameters: z.object({
      sqlQuery: z
        .string()
        .describe(
          'The SQL query to execute for fetching buildings within a specific bounding box.'
        ),
      reasoning: z
        .string()
        .optional()
        .describe('Explanation of the query logic.'),
      tableName: z.string().describe('Unique output table name for buildings.'),
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
            details: `Successfully fetched buildings. The buildings are stored in table "${tableName}".`,
          },
        };
      } catch (error) {
        console.error('Failed to fetch buildings', error);
        return {
          llmResult: {
            success: false,
            details: 'Failed to fetch buildings.',
            errorMessage:
              error instanceof Error ? error.message : 'Unknown error',
          },
        };
      }
    },
  };
}
