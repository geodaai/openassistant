// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import type { DuckDbConnector } from '@sqlrooms/duckdb';

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
   * Optional DuckDB connector for querying
   */
  getConnector?: () => Promise<DuckDbConnector | null>;

  /**
   * Optional function to get the maximum length of the query result that will be returned to the LLM
   */
  getMaxQueryResultLength?: () => Promise<number>;
};

/**
 * Combined result type for localQuery
 */
export type LocalQueryResult = {
  llmResult: {
    success: boolean;
    datasetName?: string;
    error?: string;
    instruction?: string;
    truncatedQueryResult?: string;
  };
  additionalData?: LocalQueryAdditionalData;
};

/**
 * Additional data returned with the query result
 */
export type LocalQueryAdditionalData = {
  sql: string;
  columnData?: Record<string, unknown[]>;
  queryDatasetName: string;
  datasetName: string;
  dbTableName: string;
  variableNames: string[];
  firstFiveRows: Record<string, unknown>[];
};
