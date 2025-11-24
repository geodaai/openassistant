// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, generateId } from '@openassistant/utils';
import { z } from 'zod';
import { tableFromArrays } from 'apache-arrow';

import { duckDBStore } from './query';
import { LocalQueryContext } from './types';

export function convertArrowRowToObject(row) {
  if (row === null || typeof row !== 'object') {
    return row;
  }

  if (typeof row.toJSON === 'function') {
    const json = row.toJSON();
    for (const key in json) {
      const val = json[key];
      // Recursively convert children if they're still Arrow Rows
      if (val && typeof val === 'object' && typeof val.toJSON === 'function') {
        json[key] = convertArrowRowToObject(val);
      } else if (Array.isArray(val)) {
        json[key] = val.map((v) => convertArrowRowToObject(v));
      } else if (typeof val === 'bigint') {
        // Convert BigInt to string, since app like kepler.gl doesn't support BigInt
        json[key] = val.toString();
      }
    }
    return json;
  }

  if (Array.isArray(row)) {
    return row.map(convertArrowRowToObject);
  }

  return row;
}

export const mergeTables: OpenAssistantTool<
  MergeTablesArgs,
  MergeTablesLllmResult,
  MergeTablesAdditionalData,
  LocalQueryContext
> = {
  name: 'mergeTables',
  description: `Merge table B to table A into a new table using SQL in duckdb.
- If merge horizontally, table A and B should be joined on a key column that exists in both tables.
  - e.g. SELECT A.id, A.name, A.INCOME, B.POP, B.INCOME AS B_INCOME FROM A JOIN B USING (id)
- If merge vertically, the tables should have the same columns.
  - e.g. SELECT id, name, income FROM A UNION ALL SELECT id, name, income FROM B
IMPORTANT:
  - Please do not use * in the SQL query, instead use the column names of table A and B.
`,
  parameters: z.object({
    datasetNameA: z.string(),
    datasetNameB: z.string(),
    columnNamesA: z.array(z.string()).describe('The columns of table A.'),
    columnNamesB: z.array(z.string()).describe('The columns of table B.'),
    mergeType: z.enum(['horizontal', 'vertical']),
    keyColumn: z
      .string()
      .optional()
      .describe('The key column to join on if merge horizontally.'),
    dbTableNameA: z
      .string()
      .describe(
        'The alias of table A based on databaseNameA. Please use datasetName plus a 6-digit random number to avoid conflicts.'
      ),
    dbTableNameB: z
      .string()
      .describe(
        'The alias of table B based on databaseNameB. Please use datasetName plus a 6-digit random number to avoid conflicts.'
      ),
    sql: z.string(),
  }),
  execute: async (
    {
      datasetNameA,
      datasetNameB,
      columnNamesA,
      columnNamesB,
      mergeType,
      keyColumn,
      sql,
      dbTableNameA,
      dbTableNameB,
    },
    options
  ): Promise<MergeTablesToolResult> => {
    try {
      const { getValues, getConnector: getUserConnector } =
        options?.context as LocalQueryContext;

      if (mergeType !== 'horizontal' && mergeType !== 'vertical') {
        throw new Error('Invalid merge type');
      }

      if (mergeType === 'horizontal') {
        if (
          !keyColumn ||
          !columnNamesA.includes(keyColumn) ||
          !columnNamesB.includes(keyColumn)
        ) {
          throw new Error(
            'Key column is not in table A or B. Please provide a key column for horizontal merge.'
          );
        }
      }

      // get values for variables in tableA
      const columnDataA = {};
      for (const columnName of columnNamesA) {
        columnDataA[columnName] = await getValues(datasetNameA, columnName);
      }

      // get values for variables in tableB
      const columnDataB = {};
      for (const columnName of columnNamesB) {
        columnDataB[columnName] = await getValues(datasetNameB, columnName);
      }

      // create arrow table from column data
      const arrowTableA = tableFromArrays(columnDataA);
      const arrowTableB = tableFromArrays(columnDataB);

      // Get the connector (either user-provided or default)
      const connector = (await getUserConnector?.()) || (await duckDBStore.getState().db.getConnector());
      if (!connector) {
        throw new Error('DuckDB connector is not initialized');
      }

      // create table A and B
      await connector.query(`DROP TABLE IF EXISTS ${dbTableNameA}`);
      await connector.query(`DROP TABLE IF EXISTS ${dbTableNameB}`);
      
      // Use SQLRooms store for Arrow table insertion
      const addTable = duckDBStore.getState().db.addTable;
      await addTable(dbTableNameA, arrowTableA);
      await addTable(dbTableNameB, arrowTableB);

      // run merge query
      const arrowResult = await connector.query(sql);

      // convert arrowResult to a JSON object
      const jsonResult: Record<string, unknown>[] = arrowResult
        .toArray()
        .map((row) => convertArrowRowToObject(row));

      // Get first 2 rows of the result as a json object to LLM
      const firstTwoRows = jsonResult.slice(0, 2);

      const queryDatasetName = `merge_${generateId()}`;

      return {
        llmResult: {
          success: true,
          firstTwoRows,
          details: `The merge has been completed. The result is stored in the dataset ${queryDatasetName}.`,
        },
        additionalData: {
          sql,
          datasetName: queryDatasetName,
          [queryDatasetName]: {
            type: 'rowObjects',
            content: jsonResult,
          },
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          instruction:
            'Please explain the error and give a plan to fix the error. Then try again with a different query.',
        },
      };
    }
  },
  context: {
    getValues: () => {
      // get the values of the variable from the dataset,
      // the values will be used to create and plot the histogram
      throw new Error('getValues() of mergeTables is not implemented');
    },
  },
};

export type MergeTablesArgs = z.ZodObject<{
  datasetNameA: z.ZodString;
  datasetNameB: z.ZodString;
  columnNamesA: z.ZodArray<z.ZodString>;
  columnNamesB: z.ZodArray<z.ZodString>;
  mergeType: z.ZodEnum<['horizontal', 'vertical']>;
  keyColumn: z.ZodOptional<z.ZodString>;
  dbTableNameA: z.ZodString;
  dbTableNameB: z.ZodString;
  sql: z.ZodString;
}>;

export type MergeTablesLllmResult = {
  success: boolean;
  error?: string;
  instruction?: string;
  firstTwoRows?: Record<string, unknown>[];
  details?: string;
};

export type MergeTablesAdditionalData = {
  sql: string;
  datasetName: string;
  [key: string]: unknown;
};

export type MergeTablesToolResult = {
  llmResult: MergeTablesLllmResult;
  additionalData?: MergeTablesAdditionalData;
};

export type MergeTablesTool = typeof mergeTables;
