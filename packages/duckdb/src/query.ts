import * as duckdb from '@duckdb/duckdb-wasm';

const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

/**
 * @internal
 * The duckdb instance if not provided by the user.
 */
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
  getValues: (datasetName: string, variableName: string) => Promise<unknown[]>;
  duckDB?: duckdb.AsyncDuckDB;
  onSelected?: OnSelectedCallback;
  config: {
    isDraggable?: boolean;
  };
};
