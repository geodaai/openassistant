import { AsyncDuckDB } from '@duckdb/duckdb-wasm';
import { z } from 'zod';

/**
 * Parameters for the localQuery tool
 */
export type LocalQueryArgs = z.ZodObject<{
  /** The name of the original dataset */
  datasetName: z.ZodString;
  /** The names of the variables to include in the query */
  variableNames: z.ZodArray<z.ZodString>;
  /** The SQL query to execute (following duckdb syntax) */
  sql: z.ZodString;
  /** The name of the table used in the sql string */
  dbTableName: z.ZodString;
}>;

/**
 * Context object for the localQuery tool
 */
export type LocalQueryContext = {
  /**
   * Function to get values from a dataset
   * @param datasetName - The name of the dataset
   * @param variableName - The name of the variable to get values for
   * @returns An array of values for the specified variable
   */
  getValues: (datasetName: string, variableName: string) => Promise<unknown[]>;

  /**
   * Optional DuckDB instance for querying
   */
  getDuckDB?: () => Promise<AsyncDuckDB | null>;
};

/**
 * Result data structure from a successful localQuery execution
 */
type LocalQuerySuccessResult = {
  success: true;
  data: {
    firstTwoRows: Record<string, unknown>[];
    [key: string]: unknown;
  };
};

/**
 * Result data structure from a failed localQuery execution
 */
type LocalQueryErrorResult = {
  success: false;
  error: string;
  instruction?: string;
};

/**
 * Combined result type for localQuery
 */
export type LocalQueryResult = LocalQuerySuccessResult | LocalQueryErrorResult;

/**
 * Additional data returned with the query result
 */
export type LocalQueryAdditionalData = {
  title: string;
  sql: string;
  columnData: Record<string, unknown[]>;
  variableNames: string[];
  datasetName: string;
  dbTableName: string;
};
