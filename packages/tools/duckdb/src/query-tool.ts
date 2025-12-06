// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
  generateId,
} from '@openassistant/utils';
import { Table as ArrowTable, tableFromArrays } from 'apache-arrow';
import { z } from 'zod';
import { duckDBStore } from './query';
import { LocalQueryArgs, LocalQueryContext, LocalQueryResult } from './types';
import { convertArrowRowToObject } from './merge-tool';
import { Feature } from 'geojson';

/**
 * Truncates values by converting them to strings and limiting length
 * @param obj - The object to truncate
 * @param maxLength - Maximum length for string representation
 * @returns Object with truncated string values
 */
function truncateObjectValues(obj: unknown, maxLength: number): unknown {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const truncated: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const stringValue = JSON.stringify(value);
    if (stringValue.length > maxLength) {
      truncated[key] = stringValue.substring(0, maxLength) + '...';
    } else {
      truncated[key] = value;
    }
  }

  return truncated;
}

/**
 * ## localQuery Tool
 *
 * This tool is used to execute a query against a local dataset.
 *
 * :::note
 * This tool should be executed in Browser environment for now.
 * :::
 *
 * ### Example
 * ```typescript
 * import { localQuery } from '@openassistant/duckdb';
 * import { convertToVercelAiTool } from '@openassistant/utils';
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
 *   model: 'gpt-4.1',
 *   prompt: 'What are the venues in San Francisco?',
 *   tools: {localQuery: convertToVercelAiTool(localQueryTool)},
 * });
 * ```
 */
export const localQuery: OpenAssistantTool<
  LocalQueryArgs,
  LocalQueryResult['llmResult'],
  LocalQueryResult['additionalData'],
  LocalQueryContext
> = {
  name: 'localQuery',
  description: `You are a SQL (duckdb) expert. You can help to query users datasets using select query clause.`,
  parameters: z.object({
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
  }),
  execute: executeLocalQuery,
  context: {
    getValues: () => {
      // get the values of the variable from the dataset,
      // the values will be used to create and plot the histogram
      throw new Error('getValues() of LocalQueryTool is not implemented');
    },
  },
};

async function executeLocalQuery(
  { datasetName, variableNames, sql, dbTableName },
  options?: {
    toolCallId: string;
    abortSignal?: AbortSignal;
    context?: LocalQueryContext;
  }
): Promise<
  OpenAssistantExecuteFunctionResult<
    LocalQueryResult['llmResult'],
    LocalQueryResult['additionalData']
  >
> {
  try {
    const {
      getValues,
      getConnector: getUserConnector,
      getMaxQueryResultLength,
    } = (options?.context as LocalQueryContext) || {};

    const maxQueryResultLength = (await getMaxQueryResultLength?.()) || 1000;

    // get values for each variable
    const columnData = {};
    for (const varName of variableNames) {
      let values = await getValues(datasetName, varName);

      // for values of Features, we need to normalize the Polygon to MultiPolygon
      // because when you use tableFromArrays() with a mix of Polygon and MultiPolygon GeoJSON Features,
      // you're running into a schema inference limitation: tableFromArrays() infers array nesting based on the first element.
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

    // Get the connector (either user-provided or default)
    const connector = (await getUserConnector?.()) || (await duckDBStore.getState().db.getConnector());
    if (!connector) {
      throw new Error('DuckDB connector is not initialized');
    }

    // here we don't pass the arrowResult to LLM or additionalData which could be huge

    await connector.query(`DROP TABLE IF EXISTS ${dbTableName}`);
    
    // Use SQLRooms store for Arrow table insertion
    const addTable = duckDBStore.getState().db.addTable;
    await addTable(dbTableName, arrowTable);

    // query all table names in duckdb
    // const tableNamesResult = await connector.query('SHOW TABLES');
    // const tableNames = tableNamesResult.toArray().map(row => row.toJSON());
    // console.log(tableNames);
    const arrowResult = await connector.query(sql, {
      signal: options?.abortSignal,
    });

    // convert arrowResult to a JSON object
    const jsonResult: Record<string, unknown>[] = arrowResult
      .toArray()
      .map((row) => convertArrowRowToObject(row));

    let truncatedQueryResult = '';

    for (const row of jsonResult) {
      truncatedQueryResult += JSON.stringify(truncateObjectValues(row, 100)) + '\n';
      if (truncatedQueryResult.length > maxQueryResultLength) {
        break;
      }
    }

    const queryDatasetName = `query_${generateId()}`;

    return {
      llmResult: {
        success: true,
        datasetName: queryDatasetName,
        truncatedQueryResult,
        instruction: `Query executed successfully. The complete query result is available in the dataset ${queryDatasetName} and will be displayed in the table component. The truncated result shown here is just a preview - the full dataset contains all ${jsonResult.length} rows and is ready for analysis.`,
      },
      additionalData: {
        sql,
        datasetName,
        dbTableName,
        queryDatasetName,
        variableNames,
        firstFiveRows: jsonResult.slice(0, 5),
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
