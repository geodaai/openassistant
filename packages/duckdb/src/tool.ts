import { ExtendedTool, tool } from '@openassistant/core';
import { Table as ArrowTable, tableFromArrays } from 'apache-arrow';
import { z } from 'zod';
import { getDuckDB, QueryDuckDBFunctionContext } from './query';
import { QueryDuckDBComponent } from './queryTable';

/**
 * The localQuery tool is used to execute a query against a local dataset.
 *
 * @example
 * ```typescript
 * import { localQuery } from '@openassistant/duckdb';
 *
 * const localQueryTool = {
 *   ...localQuery,
 *   context: {
 *     ...localQuery.context,
 *     getValues: (datasetName: string, variableName: string) => {
 *       // get the values of the variable from your dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 * }
 * ```
 *
 * ### getValues()
 *
 * User implements this function to get the values of the variable from dataset.
 *
 * For prompts like "_Show me the revenue per capita for each location in dataset myVenues_", the tool will
 * call the `getValues()` function twice:
 * - get the values of **revenue** from dataset: getValues('myVenues', 'revenue')
 * - get the values of **population** from dataset: getValues('myVenues', 'population')
 *
 * A duckdb table will be created using the values returned from `getValues()`, and LLM will generate a sql query to query the table to answer the user's prompt.
 *
 * ### onSelected()
 *
 * User implements this function to sync the selections of the query result table with the original dataset.
 *
 */
export const localQuery = tool({
  description:
    'You are a SQL (duckdb) expert. You can help to generate select query clause using the content of the dataset.',
  parameters: z.object({
    datasetName: z.string().describe('The name of the original dataset.'),
    variableNames: z
      .array(z.string())
      .describe('The names of the variables to include in the query.'),
    sql: z
      .string()
      .describe(
        'The SQL query to execute. Please follow the SQL syntax of duckdb.'
      ),
    dbTableName: z
      .string()
      .describe('The name of the table used in the sql string.'),
  }),
  execute: executeLocalQuery,
  context: {
    getValues: () => {
      // get the values of the variable from the dataset,
      // the values will be used to create and plot the histogram
      throw new Error('getValues() of LocalQueryTool is not implemented');
    },
    onSelected: () => {
      // sync the selections of the query result table with the original dataset
      throw new Error('onSelected() of LocalQueryTool is not implemented');
    },
    config: {
      isDraggable: false,
    },
    duckDB: null,
  },
  component: QueryDuckDBComponent,
});

async function executeLocalQuery(
  { datasetName, variableNames, sql, dbTableName },
  options
) {
  try {
    const { getValues, config, duckDB } =
      options.context as QueryDuckDBFunctionContext;
    // if the variable names contain 'row_index', ignore it
    // the row_index will be added later based on the columnData length
    // the row_index is used to sync the selections of the query result table with the original dataset
    const variableNamesWithoutRowIndex = variableNames.filter(
      (name) => name !== 'row_index'
    );
    // get values for each variable
    const columnData = variableNamesWithoutRowIndex.reduce((acc, varName) => {
      try {
        acc[varName] = getValues(datasetName, varName);
      } catch {
        throw new Error(`variable ${varName} is not found in the dataset.`);
      }
      return acc;
    }, {});
    // add the row_index to the column data
    columnData['row_index'] = Array.from(
      { length: columnData[variableNamesWithoutRowIndex[0]].length },
      (_, i) => i
    );
    // Create Arrow Table from column data with explicit type
    const arrowTable: ArrowTable = tableFromArrays(columnData);
    // Initialize DuckDB with external instance if provided
    const db = await getDuckDB(duckDB);
    if (!db) {
      throw new Error('DuckDB instance is not initialized');
    }
    const conn = await db.connect();
    const safeDbTableName = `${dbTableName}`;
    await conn.query(`DROP TABLE IF EXISTS ${safeDbTableName}`);
    await conn.insertArrowTable(arrowTable, {
      name: safeDbTableName,
      create: true,
    });
    // query all table names in duckdb
    // const tableNamesResult = await conn.query('SHOW TABLES');
    // const tableNames = tableNamesResult.toArray().map(row => row.toJSON());
    // console.log(tableNames);
    const arrowResult = await conn.query(sql);
    // const result = arrowResult.toArray().map((row) => row.toJSON());
    await conn.close();
    // Get first 2 rows of the result as a json object
    const subResult = arrowResult.toArray().slice(0, 2);
    const firstTwoRows = subResult.map((row) => row.toJSON());

    return {
      llmResult: {
        success: true,
        data: {
          firstTwoRows,
        },
      },
      additionalData: {
        title: 'Query Result',
        sql,
        columnData,
        variableNames,
        datasetName,
        dbTableName,
        config,
      },
    };
  } catch (error) {
    console.error('Error executing local query:', error);
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        instruction:
          'Please explain the error and give a plan to fix the error. Then try again with a different query.',
      },
    };
  }
}

// Export the tools registration function
export async function registerTools(): Promise<
  Record<string, typeof localQuery>
> {
  return {
    localQuery,
  };
}
