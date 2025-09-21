// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions, generateId, z } from '@openassistant/utils';
import { Table as ArrowTable, tableFromArrays } from 'apache-arrow';
import { getDuckDB } from './query';
import {
  LocalQueryArgs,
  LocalQueryContext,
  LocalQueryResult,
} from './types';
import { convertArrowRowToObject } from './merge';
import { Feature } from 'geojson';

/**
 * ## LocalQueryTool Class
 * 
 * The LocalQueryTool class executes SQL queries against local datasets using DuckDB.
 * This tool extends OpenAssistantTool and provides a class-based approach for database
 * operations in the browser environment.
 *
 * :::note
 * This tool should be executed in Browser environment for now.
 * :::
 *
 * ### Example
 * ```typescript
 * import { LocalQueryTool } from '@openassistant/duckdb';
 * import { generateText } from 'ai';
 *
 * // Simple usage with defaults
 * const localQueryTool = new LocalQueryTool();
 *
 * // Or with custom context and callbacks
 * const localQueryTool = new LocalQueryTool(
 *   undefined, // use default description
 *   undefined, // use default parameters
 *   {
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // get the values of the variable from your dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   },
 *   LocalQueryComponent,
 *   (toolCallId, additionalData) => {
 *     console.log('Query completed:', toolCallId, additionalData);
 *   }
 * );
 *
 * generateText({
 *   model: 'gpt-4o-mini',
 *   prompt: 'What are the venues in San Francisco?',
 *   tools: {localQuery: localQueryTool.toVercelAiTool()},
 * });
 * ```
 *
 * ### Example with useChat
 *
 * `app/api/chat/route.ts`
 * ```typescript
 * import { LocalQueryTool } from '@openassistant/duckdb';
 * import { streamText } from 'ai';
 *
 * // localQuery tool will be running on the client side
 * const localQueryTool = new LocalQueryTool(
 *   'Execute SQL queries against local datasets',
 *   LocalQueryArgs,
 *   { } // context
 * );
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
 * import { LocalQueryTool } from '@openassistant/duckdb';
 *
 * const myLocalQuery = new LocalQueryTool(
 *   'Execute SQL queries against local datasets',
 *   LocalQueryArgs,
 *   {
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // get the values of the variable from your dataset, e.g.
 *       return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *     },
 *   }
 * );
 *
 * const { messages, input, handleInputChange, handleSubmit } = useChat({
 *   maxSteps: 20,
 *   tools: {
 *     localQuery: myLocalQuery.toVercelAiTool()
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
export class LocalQueryTool extends OpenAssistantTool<typeof LocalQueryArgs> {
  protected readonly defaultDescription = 'Execute SQL queries against local datasets using DuckDB';
  protected readonly defaultParameters = LocalQueryArgs;

  constructor(options: OpenAssistantToolOptions<typeof LocalQueryArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getValues: () => {
          // get the values of the variable from the dataset,
          // the values will be used to create and plot the histogram
          throw new Error('getValues() of LocalQueryTool is not implemented');
        },
      },
    });
  }

  async execute(
    params: z.infer<typeof LocalQueryArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<LocalQueryResult> {
    return executeLocalQuery(params, options);
  }
}

export const LocalQueryArgs = z.object({
  datasetName: z.string(),
  variableNames: z
    .array(z.string())
    .describe(
      'Only use variable names already exist in the dataset. New columns created via SQL expressions should only be referenced in the SQL query.'
    ),
  dbTableName: z
    .string()
    .describe(
      'The alias of the table created from from the dataset specified by datasetName. Please use datasetName plus a 6-digit random number to avoid conflicts.'
    ),
  sql: z
    .string()
    .describe(
      'IMPORTANT: please use dbTableName instead of the datasetName in SQL query.'
    ),
});

// For backward compatibility, create a default instance
export const localQuery = new LocalQueryTool();

async function executeLocalQuery(
  { datasetName, variableNames, sql, dbTableName },
  options
): Promise<LocalQueryResult> {
  try {
    const { getValues, getDuckDB: getUserDuckDB } =
      options.context as LocalQueryContext;

    // get values for each variable
    const columnData = {};
    for (const varName of variableNames) {
      let values = await getValues(datasetName, varName);

      // for values of Features, we need to normalize the Polygon to MultiPolygon
      // because when you use tableFromArrays() with a mix of Polygon and MultiPolygon GeoJSON Features,
      // you’re running into a schema inference limitation: tableFromArrays() infers array nesting based on the first element.
      const firstValue = values[0];
      // check if firstValue is a Feature
      if (
        firstValue &&
        typeof firstValue === 'object' &&
        'type' in firstValue &&
        firstValue.type === 'Feature'
      ) {
        // check if Feature.geometry is a Polygon or MultiPolygon
        if (
          (firstValue as Feature).geometry.type === 'Polygon' ||
          (firstValue as Feature).geometry.type === 'MultiPolygon'
        ) {
          // convert values to MultiPolygon
          values = values.map((f: unknown) => {
            const feature = f as Feature;
            return {
              ...feature,
              geometry:
                feature.geometry.type === 'Polygon'
                  ? {
                      type: 'MultiPolygon',
                      coordinates: [feature.geometry.coordinates],
                    }
                  : feature.geometry,
            };
          });
        }
      }

      columnData[varName] = values;
    }

    // Create Arrow Table from column data with explicit type
    const arrowTable: ArrowTable = tableFromArrays(columnData);

    // Initialize DuckDB with external instance if provided
    const userDuckDB = await getUserDuckDB?.();
    const db = await getDuckDB(userDuckDB ?? undefined);
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

    // convert arrowResult to a JSON object
    const jsonResult: Record<string, unknown>[] = arrowResult
      .toArray()
      .map((row) => convertArrowRowToObject(row));

    // Get first row of the result as a json object to LLM
    const firstRow = jsonResult[0];

    const queryDatasetName = `query_${generateId()}`;

    return {
      llmResult: {
        success: true,
        datasetName: queryDatasetName,
        firstRow,
        instruction: `Query successfully. The query result is stored in the dataset ${queryDatasetName}. You can use the first row of the result as a sample to understand the query result.`,
      },
      additionalData: {
        sql,
        datasetName,
        dbTableName,
        queryDatasetName,
        variableNames,
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

// Export the class as the main type
export type { LocalQueryTool };
