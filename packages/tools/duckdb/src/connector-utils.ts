// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * Utility functions for working with the SQLRooms DuckDB connector
 * 
 * This module provides helper functions that demonstrate the enhanced
 * capabilities available through the SQLRooms integration.
 * 
 * @module connector-utils
 */

import { duckDBStore } from './query';
import type { DuckDbConnector } from '@sqlrooms/duckdb';

/**
 * Execute a query with automatic cancellation support
 * 
 * @example
 * ```typescript
 * const controller = new AbortController();
 * const result = await queryCancellable('SELECT * FROM large_table', controller.signal);
 * 
 * // Cancel the query from elsewhere
 * setTimeout(() => controller.abort(), 5000); // Cancel after 5 seconds
 * ```
 */
export async function queryCancellable(
  sql: string,
  signal?: AbortSignal
) {
  const connector = await duckDBStore.getState().db.getConnector();
  const queryHandle = connector.query(sql, { signal });
  
  // The handle is Promise-like, so you can await it directly
  return await queryHandle;
}

/**
 * Execute multiple queries with coordinated cancellation
 * 
 * @example
 * ```typescript
 * const controller = new AbortController();
 * const results = await executeMultipleQueries([
 *   'SELECT * FROM table1',
 *   'SELECT * FROM table2',
 *   'SELECT * FROM table3'
 * ], controller.signal);
 * 
 * // Cancel all queries at once
 * controller.abort();
 * ```
 */
export async function executeMultipleQueries(
  queries: string[],
  signal?: AbortSignal
) {
  const connector = await duckDBStore.getState().db.getConnector();
  const handles = queries.map(query => connector.query(query, { signal }));
  
  // Wait for all queries to complete
  return await Promise.all(handles);
}

/**
 * Execute a query with timeout
 * 
 * @example
 * ```typescript
 * try {
 *   const result = await queryWithTimeout('SELECT * FROM huge_table', 10000);
 * } catch (error) {
 *   if (error.name === 'AbortError') {
 *     console.log('Query timed out');
 *   }
 * }
 * ```
 */
export async function queryWithTimeout(
  sql: string,
  timeoutMs: number
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const connector = await duckDBStore.getState().db.getConnector();
    const result = await connector.query(sql, { signal: controller.signal });
    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Load data from various sources using the SQLRooms connector
 * 
 * @example
 * ```typescript
 * // Load from a CSV file
 * await loadDataToTable(csvFile, 'my_table');
 * 
 * // Load from JavaScript objects
 * const data = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
 * await loadDataToTable(data, 'users');
 * ```
 */
export async function loadDataToTable(
  data: File | Record<string, unknown>[],
  tableName: string
) {
  const connector = await duckDBStore.getState().db.getConnector();
  
  if (data instanceof File) {
    await connector.loadFile(data, tableName, { 
      method: 'auto',
      replace: true 
    });
  } else if (Array.isArray(data)) {
    await connector.loadObjects(data, tableName, { 
      replace: true 
    });
  } else {
    throw new Error('Unsupported data type');
  }
}

/**
 * Execute a query and return results as JSON
 * 
 * @example
 * ```typescript
 * const users = await queryToJson('SELECT * FROM users LIMIT 10');
 * for (const user of users) {
 *   console.log(user.name, user.email);
 * }
 * ```
 */
export async function queryToJson<T = Record<string, unknown>>(
  sql: string,
  signal?: AbortSignal
): Promise<T[]> {
  const connector = await duckDBStore.getState().db.getConnector();
  const handle = connector.queryJson<T>(sql, { signal });
  const iterable = await handle;
  return Array.from(iterable);
}

/**
 * Check if the connector is ready
 */
export async function isConnectorReady(): Promise<boolean> {
  try {
    const connector = await duckDBStore.getState().db.getConnector();
    return connector !== null;
  } catch {
    return false;
  }
}

/**
 * Get the raw connector for advanced operations
 * 
 * This exposes the full SQLRooms DuckDbConnector interface for advanced use cases.
 * See https://sqlrooms.org for full API documentation.
 */
export async function getRawConnector(): Promise<DuckDbConnector> {
  return await duckDBStore.getState().db.getConnector();
}

