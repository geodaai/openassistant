import { tool, generateId } from '@openassistant/utils';
import { Table as ArrowTable, tableFromArrays } from 'apache-arrow';
import { z } from 'zod';
import { getDuckDB, QueryDuckDBFunctionContext } from './query';

/**
 * [**Browser Tool**] The localQuery tool is used to execute a query against a local dataset.
 *
 * @example
 * ```typescript
 * import { getDuckDBTool } from '@openassistant/duckdb';
 *
 *
 * // context
 * const context = {
 *   getValues: (datasetName: string, variableName: string) => {
 *     // get the values of the variable from your dataset, e.g.
 *     return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *   },
 * }
 *
 * const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
 *   // do something with the additionalData
 * }
 *
 * // get the tool
 * const localQueryTool = getDuckDBTool('localQuery', {context, onToolCompleted});
 *
 * generateText({
 *   model: 'gpt-4o-mini',
 *   prompt: 'What are the venues in San Francisco?',
 *   tools: {localQuery: localQueryTool},
 * });
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
 * ## Server Side Usage
 *
 * Here is an example of how to use the localQuery tool in server side:
 *
 * `app/api/chat/route.ts`
 * ```typescript
 * import { getDuckDBTools } from '@openassistant/duckdb';
 *
 * // localQuery tool will be running on the client side
 * const localQueryTool = getDuckDBTool('localQuery', {isExecutable: false});
 *
 * export async function POST(req: Request) {
 *   // ...
 *   const result = streamText({
 *     model: openai('gpt-4o-mini'),
 *     messages: messages,
 *     tools: {localQuery: localQueryTool},
 *   });
 * }
 * ```
 *
 * `app/page.tsx`
 * ```typescript
 * import { useChat } from 'ai/react';
 * import { getDuckDBTool } from '@openassistant/duckdb';
 *
 * const localQueryTool = getDuckDBTool('localQuery', {
 *   context: {
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // get the values of the variable from your dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 *   onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
 *     // do something with the additionalData
 *   },
 *   isExecutable: true,
 * });
 *
 * const { messages, input, handleInputChange, handleSubmit } = useChat({
 *   maxSteps: 20,
 *   onToolCall: async (toolCallId, toolCall) => {
 *      if (toolCall.name === 'localQuery') {
 *        const result = await localQueryTool.execute(toolCall.args, toolCall.options);
 *        return result;
 *      }
 *   }
 * });
 * ```
 */
export const localQuery = tool({
  description: `You are a SQL (duckdb) expert. You can help to query users datasets using select query clause.`,
  parameters: z.object({
    datasetName: z.string().describe('The name of the original dataset.'),
    variableNames: z
      .array(z.string())
      .describe('The names of the variables to include in the query.'),
    dbTableName: z
      .string()
      .describe(
        'The name of the table to create and query. Please append a 6-digit random number to the end of the table name to avoid conflicts.'
      ),
    sql: z
      .string()
      .describe(
        'The SQL query to execute. Please follow the SQL syntax of duckdb. Please use the dbTableName to query the table.'
      ),
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
});

async function executeLocalQuery(
  { datasetName, variableNames, sql, dbTableName },
  options
) {
  try {
    const { getValues, config, duckDB } =
      options.context as QueryDuckDBFunctionContext;

    // get values for each variable
    const columnData = {};
    for (const varName of variableNames) {
      columnData[varName] = await getValues(datasetName, varName);
    }

    // Create Arrow Table from column data with explicit type
    const arrowTable: ArrowTable = tableFromArrays(columnData);

    // Initialize DuckDB with external instance if provided
    const db = await getDuckDB(duckDB);
    if (!db) {
      throw new Error('DuckDB instance is not initialized');
    }

    // here we don't pass the arrowResult to LLM or additionalData

    const conn = await db.connect();
    await conn.query(`DROP TABLE IF EXISTS ${dbTableName}`);
    await conn.insertArrowTable(arrowTable, {
      name: dbTableName,
      create: true,
    });

    // query all table names in duckdb
    // const tableNamesResult = await conn.query('SHOW TABLES');
    // const tableNames = tableNamesResult.toArray().map(row => row.toJSON());
    // console.log(tableNames);
    const arrowResult = await conn.query(sql);

    await conn.close();

    // Get first 2 rows of the result as a json object to LLM
    const subResult = arrowResult.toArray().slice(0, 2);
    const firstTwoRows = subResult.map((row) => {
      const json = row.toJSON();
      // Convert any BigInt values to strings
      return Object.fromEntries(
        Object.entries(json).map(([key, value]) => [
          key,
          typeof value === 'bigint' ? value.toString() : value,
        ])
      );
    });

    return {
      llmResult: {
        success: true,
        dbTableName,
        data: {
          firstTwoRows,
        },
      },
      additionalData: {
        title: 'Query Result',
        sql,
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
