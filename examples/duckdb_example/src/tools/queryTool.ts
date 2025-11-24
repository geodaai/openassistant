import {
  QueryToolParameters,
  getQuerySummary,
  QueryToolResult,
} from '@sqlrooms/ai';
import { arrowTableToJson, splitSqlStatements } from '@sqlrooms/duckdb';

export const queryTool = {
  name: 'query',
  description: `A tool for running SQL queries on the tables in the database.
Please only run one query at a time.
If a query fails, please don't try to run it again with the same syntax.`,
  parameters: QueryToolParameters,
  execute: async (
    params: QueryToolParameters,
    options?: { abortSignal?: AbortSignal; context?: any }
  ) => {
    const { type, sqlQuery } = params;
    const abortSignal = options?.abortSignal;

    try {
      // Check if aborted before starting
      if (abortSignal?.aborted) {
        throw new Error('Query execution was aborted');
      }

      const { getStore, args } = options?.context;
      const {
        readOnly = true,
        autoSummary = false,
        numberOfRowsToShareWithLLM = 5,
      } = args || {};

      const connector = await getStore().getState().db.getConnector();
      const parsedQuery = await getStore().getState().db.sqlSelectToJson(sqlQuery);

      if (
        parsedQuery.error &&
        // Only SELECT statements can be serialized to json, so we ignore not implemented errors
        parsedQuery.error_type !== 'not implemented'
      ) {
        throw new Error(parsedQuery.error_message);
      }

      if (readOnly) {
        if (parsedQuery.error) {
          throw new Error(
            `Query is not a valid SELECT statement: ${parsedQuery.error_message}`
          );
        }
        if (
          parsedQuery.statements.length !== 1 || // only one statement allowed
          parsedQuery.statements[0]?.node.type !== 'SELECT_NODE' // only SELECT statements allowed
        ) {
          throw new Error('Query is not a valid SELECT statement');
        }
      }

      // Check if aborted before running query
      if (abortSignal?.aborted) {
        throw new Error('Query execution was aborted');
      }

      const result = await connector.query(sqlQuery);

      // Check if aborted after query execution
      if (abortSignal?.aborted) {
        throw new Error('Query execution was aborted');
      }

      const summaryData = await (async () => {
        if (!autoSummary) return null;
        if (parsedQuery.error) return null;

        // Check if aborted before generating summary
        if (abortSignal?.aborted) return null;

        const lastNode =
          parsedQuery.statements[parsedQuery.statements.length - 1]?.node;

        // Only get summary if the last statement isn't already a SUMMARIZE query
        if (
          lastNode?.type === 'SELECT_NODE' &&
          lastNode?.from_table?.show_type === 'SUMMARY'
        ) {
          return arrowTableToJson(result);
        }
        const statements = splitSqlStatements(sqlQuery);
        const lastStatement = statements[statements.length - 1];
        if (!lastStatement) return null;
        return await getQuerySummary(connector, lastStatement);
      })();

      // Conditionally get rows of the result as a json object based on numberOfRowsToShareWithLLM
      const firstRows =
        numberOfRowsToShareWithLLM > 0
          ? arrowTableToJson(result.slice(0, numberOfRowsToShareWithLLM))
          : [];

      return {
        llmResult: {
          success: true,
          data: {
            type,
            summary: summaryData,
            ...(numberOfRowsToShareWithLLM > 0 ? { firstRows } : {}),
          },
        },
        additionalData: {
          title: 'Query Result',
          sqlQuery,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          details: 'Query execution failed.',
          errorMessage:
            error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },
  component: QueryToolResult,
};
