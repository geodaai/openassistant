// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  createDuckDbSlice,
  type DuckDbSliceState,
} from '@sqlrooms/duckdb';
import {
  createRoomStore,
  createBaseRoomSlice,
  type BaseRoomStoreState,
} from '@sqlrooms/room-store';

/**
 * DuckDB store state interface that combines base room state with DuckDB slice
 */
type DuckDBStore = BaseRoomStoreState & DuckDbSliceState;


/**
 * Create a room store for DuckDB management using SQLRooms DuckDB slice
 */
const storeResult = createRoomStore<DuckDBStore>((set, get, store) => {
  const baseSlice = createBaseRoomSlice()(set, get, store);
  const duckDbSlice = createDuckDbSlice()(set, get, store);

  return {
    // Base room slice
    ...baseSlice,

    // DuckDB slice
    ...duckDbSlice,
  };
});

export const { roomStore: duckDBStore, useRoomStore: useDuckDBStore } =
  storeResult;

/**
 * Example usage of the SQLRooms DuckDB slice:
 *
 * ```typescript
 * // In a React component:
 * const createTableFromQuery = useDuckDBStore((state) => state.db.createTableFromQuery);
 * const addTable = useDuckDBStore((state) => state.db.addTable);
 * const dropTable = useDuckDBStore((state) => state.db.dropTable);
 * const tables = useDuckDBStore((state) => state.db.tables);
 * const refreshTableSchemas = useDuckDBStore((state) => state.db.refreshTableSchemas);
 *
 * // Additional utility methods for tools:
 * const getConnector = useDuckDBStore((state) => state.db.getConnector);
 *
 * // Create a table from a query
 * await createTableFromQuery('filtered_data', 'SELECT * FROM my_table WHERE condition = true');
 *
 * // Add a table from Arrow data
 * await addTable('my_new_table', arrowTable);
 *
 * // Drop a table
 * await dropTable('old_table');
 *
 * // Get current tables
 * const currentTables = tables;
 *
 * // Refresh table schemas
 * await refreshTableSchemas();
 *
 * // Use in tools:
 * const connector = await duckDBStore.getState().db.getConnector();
 * const result = await connector.query('SELECT * FROM table');
 * ```
 */

