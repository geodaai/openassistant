import { z } from 'zod';
import { AsyncDuckDB } from '@duckdb/duckdb-wasm';
import { ExtendedTool } from '@openassistant/core';

/**
 * Parameters for the localQuery tool
 */
export interface LocalQueryParameters {
  /** The name of the original dataset */
  datasetName: string;
  /** The names of the variables to include in the query */
  variableNames: string[];
  /** The SQL query to execute (following duckdb syntax) */
  sql: string;
  /** The name of the table used in the sql string */
  dbTableName: string;
}

/**
 * Context object for the localQuery tool
 */
export interface LocalQueryContext {
  /**
   * Function to get values from a dataset
   * @param datasetName - The name of the dataset
   * @param variableName - The name of the variable to get values for
   * @returns An array of values for the specified variable
   */
  getValues: (datasetName: string, variableName: string) => unknown[];
  
  /**
   * Function called when values are selected in the query result
   * @param datasetName - The name of the dataset
   * @param columnName - The name of the column
   * @param selectedValues - The selected values
   */
  onSelected?: (
    datasetName: string,
    columnName: string,
    selectedValues: unknown[]
  ) => void;
  
  /**
   * Configuration options
   */
  config?: {
    isDraggable?: boolean;
    [key: string]: unknown;
  };
  
  /**
   * Optional DuckDB instance for querying
   */
  duckDB?: AsyncDuckDB | null;
}

/**
 * Result data structure from a successful localQuery execution
 */
export interface LocalQuerySuccessResult {
  success: true;
  data: {
    firstTwoRows: Record<string, unknown>[];
    [key: string]: unknown;
  };
}

/**
 * Result data structure from a failed localQuery execution
 */
export interface LocalQueryErrorResult {
  success: false;
  error: string;
  instruction?: string;
}

/**
 * Combined result type for localQuery
 */
export type LocalQueryResult = LocalQuerySuccessResult | LocalQueryErrorResult;

/**
 * Additional data returned with the query result
 */
export interface LocalQueryAdditionalData {
  title: string;
  sql: string;
  columnData: Record<string, unknown[]>;
  variableNames: string[];
  datasetName: string;
  dbTableName: string;
  onSelected?: (
    datasetName: string,
    columnName: string,
    selectedValues: unknown[]
  ) => void;
}

/**
 * Full response from the localQuery execution
 */
export interface LocalQueryResponse {
  llmResult: LocalQueryResult;
  additionalData?: LocalQueryAdditionalData;
}

/**
 * Function signature for the localQuery execution
 */
export type LocalQueryExecuteFunction = (
  params: LocalQueryParameters,
  options: { context: LocalQueryContext }
) => Promise<LocalQueryResponse>;

/**
 * The complete LocalQuery tool type definition
 */
export type LocalQueryTool = ExtendedTool<z.ZodObject<{
  datasetName: z.ZodString;
  variableNames: z.ZodArray<z.ZodString>;
  sql: z.ZodString;
  dbTableName: z.ZodString;
}>>; 