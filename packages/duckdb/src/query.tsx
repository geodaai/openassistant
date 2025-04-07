'use client';

import {
  CallbackFunctionProps,
  CustomFunctionContext,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
  RegisterFunctionCallingProps,
} from '@openassistant/core';

import * as duckdb from '@duckdb/duckdb-wasm';
import {
  queryDuckDBCallbackMessage,
  QueryDuckDBOutputData,
} from './queryTable';

const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

export let db: duckdb.AsyncDuckDB | null = null;
let initializationPromise: Promise<void> | null = null;

export async function getDuckDB(externalDB?: duckdb.AsyncDuckDB) {
  if (externalDB) {
    db = externalDB;
    return db;
  }
  await initDuckDB(externalDB);
  return db;
}

export async function initDuckDB(externalDB?: duckdb.AsyncDuckDB) {
  // If already initializing, wait for that to complete
  if (initializationPromise) {
    await initializationPromise;
    return;
  }

  if (externalDB) {
    db = externalDB;
    return;
  }

  // If already initialized, return
  if (db !== null) {
    return;
  }

  // Create a new initialization promise
  initializationPromise = (async () => {
    try {
      // Select a bundle based on browser checks
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
      const worker_url = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker!}");`], {
          type: 'text/javascript',
        })
      );
      const worker = new Worker(worker_url);
      const logger = new duckdb.ConsoleLogger();
      db = new duckdb.AsyncDuckDB(logger, worker);
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    } catch (error) {
      console.error('Failed to initialize DuckDB', error);
    } finally {
      // Clear the initialization promise
      initializationPromise = null;
    }
  })();

  await initializationPromise;
}

/**
 * The callback function when the user selects values.
 * @param datasetName - The name of the dataset.
 * @param columnName - The name of the column.
 * @param selectedValues - The selected values, which is an array of the key values of the selected rows. The key is one of the variable names in the dataset.
 */
type OnSelectedCallback = (
  datasetName: string,
  columnName: string,
  selectedValues: unknown[]
) => void;

/**
 * The context of the queryDuckDB function.
 * @property getValues - Get the values of a variable from the dataset.
 * @property duckDB - The duckdb instance. It's optional. If not provided, the function will initialize a new duckdb instance, and create a new table using {@link getValues}.
 * @property onSelected - The callback function can be used to sync the selections of the query result table with the original dataset. See {@link OnSelectedCallback} for more details.
 */
export type QueryDuckDBFunctionContext = {
  getValues: (datasetName: string, variableName: string) => unknown[];
  duckDB?: duckdb.AsyncDuckDB;
  onSelected?: OnSelectedCallback;
  config: {
    isDraggable?: boolean;
  };
};

type ValueOf<T> = T[keyof T];

/**
 * The values of the queryDuckDB function context.
 * @see {@link QueryDuckDBFunctionContext}
 */
type QueryDuckDBFunctionContextValues = ValueOf<QueryDuckDBFunctionContext>;

/**
 * Define the function to query the duckdb database. You can pass getValues() to the context for creating a new table in the duckdb database.
 * If you pass a duckDB instance to the context, the function will use the existing duckDB instance to create a new table.
 * The SQL query will be executed in the duckDB instance, and the result will be displayed in a table.
 * Users can select rows in the table, and the selections can be synced back to the original dataset using the onSelected callback.
 * For sync the selections, user can select a key variable in the dataset which also present in the query result table.
 *
 * @param context - The context of the function. See {@link QueryDuckDBFunctionContext} for more details.
 * @param context.getValues - Get the values of a variable from the dataset.
 * @param context.duckDB - The duckdb instance. It's optional. If not provided, the function will initialize a new duckdb instance, and create a new table using {@link getValues}.
 * @param context.onSelected - The callback function can be used to sync the selections of the query result table with the original dataset. See {@link OnSelectedCallback} for more details.
 * @returns The function definition.
 */
export function queryDuckDBFunctionDefinition(
  context: CustomFunctionContext<QueryDuckDBFunctionContextValues>
): RegisterFunctionCallingProps {
  // Initialize DuckDB with external instance if provided
  initDuckDB((context as QueryDuckDBFunctionContext).duckDB);

  return {
    name: 'queryDuckDB',
    description:
      'You are a SQL (duckdb) expert. You can help to generate select query clause using the content of the dataset.',
    properties: {
      datasetName: {
        type: 'string',
        description: 'The name of the original dataset.',
      },
      variableNames: {
        type: 'array',
        description:
          'The names of the variables to include in the query. Please only use the variables that are present in the originaldataset.',
        items: {
          type: 'string',
        },
      },
      sql: {
        type: 'string',
        description:
          'The SQL query to execute. Please create proper SQL query clause based on the content of the dataset.',
      },
      dbTableName: {
        type: 'string',
        description: 'The name of the table used in the sql query.',
      },
    },
    required: ['datasetName', 'sql', 'dbTableName', 'variableNames'],
    callbackFunction: queryDuckDBCallbackFunction,
    callbackFunctionContext: context,
    callbackMessage: queryDuckDBCallbackMessage,
  };
}

/**
 * The arguments of the queryDuckDB function.
 * @param datasetName - The name of the original dataset.
 * @param variableNames - The names of the variables to include in the query.
 * @param sql - The SQL query to execute.
 * @param dbTableName - The name of the table used in the sql query.
 */
type QueryDuckDBFunctionArgs = {
  datasetName: string;
  variableNames: string[];
  sql: string;
  dbTableName: string;
};

/**
 * The result of the queryDuckDB function.
 *
 * @param success - Whether the function call is successful.
 * @param details - The details of the function call execution.
 */
type QueryDuckDBOutputResult =
  | ErrorCallbackResult
  | {
      success?: boolean;
      details: string;
    };

/**
 * Type guard of QueryDuckDBFunctionArgs
 */
function isQueryDuckDBFunctionArgs(
  args: unknown
): args is QueryDuckDBFunctionArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'datasetName' in args &&
    'variableNames' in args &&
    'sql' in args &&
    'dbTableName' in args
  );
}

function isQueryDuckDBFunctionContext(
  context: unknown
): context is QueryDuckDBFunctionContext {
  return (
    typeof context === 'object' && context !== null && 'getValues' in context
  );
}

/**
 * The callback function for the queryDuckDB function. When LLM calls the queryDuckDB function, it will be executed.
 * The result will be returned as a response of the function call to the LLM.
 *
 * @param props - The callback function properties
 * @param props.functionName - The name of the function
 * @param props.functionArgs - The arguments of the function
 * @param props.functionContext - The context of the function
 * @returns The result of the function
 */
export async function queryDuckDBCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<QueryDuckDBOutputResult, QueryDuckDBOutputData>
> {
  // check the arguments passed by the LLM
  if (!isQueryDuckDBFunctionArgs(functionArgs)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid queryDuckDB function arguments.',
      },
    };
  }

  const { datasetName, variableNames, sql, dbTableName } = functionArgs;

  // check the context passed by the app
  if (!isQueryDuckDBFunctionContext(functionContext)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid queryDuckDB function context.',
      },
    };
  }

  // get the context values
  const { getValues, onSelected, config } = functionContext;

  // if the variable names contain 'row_index', ignore it
  // the row_index will be added later based on the columnData length
  // the row_index is used to sync the selections of the query result table with the original dataset
  const variableNamesWithoutRowIndex = variableNames.filter(
    (name) => name !== 'row_index'
  );

  try {
    // Get values for each variable
    const columnData = variableNamesWithoutRowIndex.reduce((acc, varName) => {
      try {
        acc[varName] = getValues(datasetName, varName);
      } catch {
        throw new Error(`variable ${varName} is not found in the dataset.`);
      }
      return acc;
    }, {});
    columnData['row_index'] = Array.from(
      { length: columnData[variableNamesWithoutRowIndex[0]].length },
      (_, i) => i
    );

    return {
      type: 'query',
      name: functionName,
      result: {
        details: `Show the sql that will be executed: ${sql}, and tell the user the result will be displayed in a table.`,
      },
      data: {
        ...(db ? { db } : {}),
        columnData,
        variableNames,
        datasetName,
        sql,
        dbTableName,
        onSelected,
        isDraggable: Boolean(config?.isDraggable),
      },
    };
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: `Can not get the values of the variables. ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
    };
  }
}
