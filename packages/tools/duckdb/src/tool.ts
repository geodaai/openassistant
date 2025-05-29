import { extendedTool } from '@openassistant/utils';
import { Table as ArrowTable, tableFromArrays } from 'apache-arrow';
import { z } from 'zod';
import { getDuckDB, QueryDuckDBFunctionContext } from './query';
import {
  LocalQueryAdditionalData,
  LocalQueryArgs,
  LocalQueryContext,
  LocalQueryResult,
} from './types';

/**
 * The `localQuery` tool is used to execute a query against a local dataset.
 *
 * :::note
 * This tool should be executed in Browser environment for now.
 * :::
 *
 * ### Example
 * ```typescript
 * import { localQuery } from '@openassistant/duckdb';
 * import { convertToVercelAiTool } from '@openassistent/utils';
 * import { generateText } from 'ai';
 *
 * const localQueryTool: LocalQueryTool = {
 *   ...localQuery,
 *   context: {
 *     ...localQuery.context,
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // get the values of the variable from your dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 * };
 *
 * generateText({
 *   model: 'gpt-4o-mini',
 *   prompt: 'What are the venues in San Francisco?',
 *   tools: {localQuery: convertToVercelAiTool(localQueryTool)},
 * });
 * ```
 *
 * ### Example with useChat
 *
 * `app/api/chat/route.ts`
 * ```typescript
 * import { localQuery } from '@openassistant/duckdb';
 * import { convertToVercelAiTool } from '@openassistent/utils';
 * import { streamText } from 'ai';
 *
 * // localQuery tool will be running on the client side
 * const localQueryTool = convertToVercelAiTool(localQuery, {isExecutable: false}); 
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
 * import { localQuery } from '@openassistant/duckdb';
 * import { convertToVercelAiTool } from '@openassistent/utils';
 *
 * const myLocalQuery: LocalQueryTool = {
 *   ...localQuery,
 *   context: {
 *     ...localQuery.context,
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // get the values of the variable from your dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 * };
 *
 * const localQueryTool = convertToVercelAiTool(myLocalQuery);
 *
 * const { messages, input, handleInputChange, handleSubmit } = useChat({
 *   maxSteps: 20,
 *   onToolCall: async (toolCall) => {
 *      if (toolCall.name === 'localQuery') {
 *        const result = await localQueryTool.execute(toolCall.args, toolCall.options);
 *        return result;
 *      }
 *   }
 * });
 * ```
 * 
 * ### Example with `@openassistant/ui`
 *
 * ```typescript
 * import { localQuery } from '@openassistant/duckdb';
 * import { convertToVercelAiTool } from '@openassistent/utils';
 *
 * const localQueryTool: LocalQueryTool = {
 *   ...localQuery,
 *   context: {
 *     ...localQuery.context,
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // get the values of the variable from your dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 * }; 
 *
 *  export function App() {
 *    return (
 *      <AiAssistant
 *        apiKey={process.env.OPENAI_API_KEY || ''}
 *        modelProvider="openai"
 *        model="gpt-4o"
 *        welcomeMessage="Hello! I'm your assistant."
 *        instructions={instructions}
 *        tools={{localQuery: localQueryTool}}
 *        useMarkdown={true}
 *        theme="dark"
 *      />  
 *    );
 *  }
 * ```
 */
export const localQuery = extendedTool<
  LocalQueryArgs,
  LocalQueryResult,
  LocalQueryAdditionalData,
  LocalQueryContext
>({
  description: `You are a SQL (duckdb) expert. You can help to query users datasets using select query clause.`,
  parameters: z.object({
    datasetName: z.string(),
    variableNames: z.array(z.string()),
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

    // here we don't pass the arrowResult to LLM or additionalData which could be huge

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

/**
 * @inheritDoc {@link localQuery}
 */
export type LocalQueryTool = typeof localQuery;
