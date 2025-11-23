// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import * as duckdb from '@duckdb/duckdb-wasm';
import { createStore } from 'zustand/vanilla';
import {
  createWasmDuckDbConnector,
  type WasmDuckDbConnector,
  type DuckDbConnector,
} from '@sqlrooms/duckdb';

/**
 * DuckDB store state interface
 */
interface DuckDBStore {
  db: {
    connector: DuckDbConnector | null;
    getConnector: () => Promise<DuckDbConnector>;
  };
}

/**
 * @internal
 * The duckdb instance if not provided by the user.
 */
export let db: duckdb.AsyncDuckDB | null = null;
let connector: WasmDuckDbConnector | null = null;
let initializationPromise: Promise<void> | null = null;

/**
 * Create a Zustand store for DuckDB management
 */
export const duckDBStore = createStore<DuckDBStore>((set, get) => ({
  db: {
    connector: null,
    getConnector: async () => {
      await initDuckDB();
      const currentConnector = get().db.connector;
      if (!currentConnector) {
        throw new Error('Failed to initialize DuckDB connector');
      }
      return currentConnector;
    },
  },
}));

/**
 * Get the DuckDB instance
 * @param externalDB - Optional external DuckDB instance to use
 * @returns The DuckDB instance
 */
export async function getDuckDB(externalDB?: duckdb.AsyncDuckDB) {
  if (externalDB) {
    db = externalDB;
    return db;
  }
  await initDuckDB();
  return db;
}

/**
 * Initialize the DuckDB instance and connector
 * @param externalDB - Optional external DuckDB instance to use
 */
export async function initDuckDB() {
  // If already initializing, wait for that to complete
  if (initializationPromise) {
    await initializationPromise;
    return;
  }

  // If already initialized, return
  if (db !== null && connector !== null) {
    return;
  }

  // Create a new initialization promise
  initializationPromise = (async () => {
    try {
      // Create a WASM DuckDB connector using SQLRooms
      // Keep initialization minimal - specific tools can load extensions as needed
      connector = createWasmDuckDbConnector({
        path: ':memory:',
        logging: false,
      });

      // Initialize the connector (this handles bundle loading, worker creation, etc.)
      await connector.initialize();

      // Get the underlying DuckDB instance for backward compatibility
      db = connector.getDb();

      // Update the store with the connector
      duckDBStore.setState({
        db: {
          ...duckDBStore.getState().db,
          connector,
        },
      });
    } catch (error) {
      console.error('Failed to initialize DuckDB', error);
      throw error;
    } finally {
      // Clear the initialization promise
      initializationPromise = null;
    }
  })();

  await initializationPromise;
}

/**
 * Get the DuckDB connector (SQLRooms connector)
 * @returns The DuckDB connector instance
 */
export async function getConnector(): Promise<DuckDbConnector> {
  return duckDBStore.getState().db.getConnector();
}
