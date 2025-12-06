import {z} from 'zod';
import { MutableRefObject } from 'react';
import { splitSqlStatements } from '@sqlrooms/duckdb';

/**
 * Creates a lazy getCityBoundary tool that defers store initialization.
 * This is useful when the store is not available at the time of tool creation.
 *
 * @param storeRef - A React ref that will eventually contain the roomStore
 * @returns A tool configuration object for the getCityBoundary tool
 */
export function createGetCityBoundaryTool(storeRef: MutableRefObject<any>) {
  return {
    name: 'getCityBoundaries',
    description: `Retrieve the boundary geometries (polygons) of cities.
- When you have specific city names (e.g., "Philadelphia", "New York", "Houston"), use the following SQL query template:

---sql start---
LOAD httpfs;
LOAD spatial;
SET s3_region='us-west-2';
SELECT
  id,
  names.primary as name,
  region,
  geometry AS geom
FROM
  read_parquet('s3://overturemaps-us-west-2/release/2025-10-22.0/theme=divisions/type=division_area/*', filename=true, hive_partitioning=1)
WHERE
  names.primary IN ('San Francisco', 'Houston')
  AND region IN ('US-CA', 'US-TX')
  AND class = 'land'
  AND is_land = TRUE
---sql end---
`,
    parameters: z.object({
      sqlQuery: z.string().describe('The SQL query to execute for fetching city boundaries.'),
      reasoning: z.string().optional().describe('Explanation of the query logic.'),
      tableName: z.string().describe('Unique output table name for city boundaries.'),
    }),
    execute: async (
      {sqlQuery, tableName}: {sqlQuery: string; reasoning?: string; tableName: string},
      options?: {abortSignal?: AbortSignal}
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

        // Execute the query
        const arrowResult = await connector.query(sqlQuery, {
          signal: abortSignal,
        });

        if (!arrowResult || arrowResult.numRows === 0) {
          return {
            llmResult: {
              success: false,
              details: 'No city boundaries found.',
            },
          };
        }

        const statements = splitSqlStatements(sqlQuery);
        // find the SELECT statement
        const selectStatement = statements.find((statement) => statement.startsWith('SELECT'));
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

        // Get city names from the result
        const cityNames = arrowResult.toArray().map((row: {name: string}) => row.name);

        return {
          llmResult: {
            success: true,
            details: `Successfully fetched city boundaries for ${cityNames.join(', ')}. The boundaries are stored in table "${tableName}".`,
          },
        };
      } catch (error) {
        console.error('Failed to fetch city boundaries', error);
        return {
          llmResult: {
            success: false,
            details: 'Failed to fetch city boundary.',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          },
        };
      }
    },
  };
}
