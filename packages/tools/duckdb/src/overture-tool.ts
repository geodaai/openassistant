// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
} from '@openassistant/utils';
import { z } from 'zod';
import { duckDBStore } from './query';
import type { DuckDbConnector } from '@sqlrooms/duckdb';

export type OvertureQueryArgs = z.ZodObject<{
  query: z.ZodString;
  tableName: z.ZodString;
}>;

export type OvertureQueryResult = {
  llmResult: {
    success: boolean;
    details: string;
    error?: string;
  };
  additionalData?: Record<string, unknown>;
};

export type OvertureQueryContext = {
  /**
   * Optional DuckDB connector for querying
   */
  getConnector?: () => Promise<DuckDbConnector | null>;
};

export const overtureQueryTool: OpenAssistantTool<
  OvertureQueryArgs,
  OvertureQueryResult['llmResult'],
  OvertureQueryResult['additionalData'],
  OvertureQueryContext
> = {
  name: 'overtureQuery',
  description: `You are a duckdb and overture maps expert. You can help to query overture maps using select query clause.`,
  parameters: z.object({
    query: z.string().describe('The SQL query to execute'),
    tableName: z
      .string()
      .describe('The name of the table to save the query result'),
  }),
  execute: executeOvertureQuery,
};

async function executeOvertureQuery(
  { query, tableName },
  options?: {
    toolCallId: string;
    abortSignal?: AbortSignal;
    context?: OvertureQueryContext;
  }
): Promise<
  OpenAssistantExecuteFunctionResult<
    OvertureQueryResult['llmResult'],
    OvertureQueryResult['additionalData']
  >
> {
  try {
    const { getConnector: getUserConnector } =
      (options?.context as OvertureQueryContext) || {};

    // Get the connector (either user-provided or default)
    const connector = (await getUserConnector?.()) || (await duckDBStore.getState().db.getConnector());
    if (!connector) {
      throw new Error('DuckDB connector is not initialized');
    }

    // await connector.query(`INSTALL httpfs;`);
    // await connector.query(`LOAD httpfs;`);
    // await connector.query(`INSTALL spatial;`);
    // await connector.query(`LOAD spatial;`);
    // await connector.query(`SET s3_region='us-west-2';`);

    // The query itself should contain LOAD httpfs, LOAD spatial, and SET s3_region commands
    // Execute the Overture query using the connector
    const arrowResult = await connector.query(query, {
      signal: options?.abortSignal,
    });

    // Save the arrow result as a table in duckdb using the SQLRooms store
    const addTable = duckDBStore.getState().db.addTable;
    await addTable(tableName, arrowResult);

    return {
      llmResult: {
        success: true,
        details: `Query executed successfully. The complete query result is available in the table ${tableName} and will be displayed in the table component.`,
      },
      additionalData: {},
    };
  } catch (error) {
    console.error('Error executing local query:', error);
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        details:
          'Please explain the error and give a plan to fix the error. Then try again with a different query.',
      },
    };
  }
}

/**
 * @inheritDoc {@link localQuery}
 */
export type OvertureQueryTool = typeof overtureQueryTool;

export const getStateOrProvinceBoundariesTool = {
  ...overtureQueryTool,
  name: 'getStateOrProvinceBoundaries',
  description: `Retrieves the boundary geometries (polygons) of states or provinces.
IMPORTANT: Use the following SQL query template. Do NOT use any other SQL query template.
When you have a bounding box (latitude/longitude coordinates), use the following SQL query template:
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
  subtype = 'region'
  AND bbox.xmin <= -121.5 AND bbox.xmax >= -123.5
  AND bbox.ymin <=  38.2  AND bbox.ymax >=   37.2
  AND class = 'land'
---sql end---
When you have specific state or province names (e.g., "California", "New York", "Texas", "Ontario", "Quebec"), use the following SQL query template:
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
  names.primary IN ('California', 'New York', 'Texas')
  AND subtype = 'region'
  AND class = 'land'
---sql end---`,
};
