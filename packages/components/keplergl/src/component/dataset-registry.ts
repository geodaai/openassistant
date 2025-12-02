// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import type { GetDatasetFunction } from './keplergl-component';

/**
 * A simple registry for storing getDataset functions.
 * This allows the tool to register a getDataset function that the component can access
 * without needing to serialize functions through state management.
 */
class DatasetRegistry {
  private static instance: DatasetRegistry;
  private registry: Map<string, GetDatasetFunction> = new Map();
  private defaultGetDataset: GetDatasetFunction | null = null;

  private constructor() {}

  static getInstance(): DatasetRegistry {
    if (!DatasetRegistry.instance) {
      DatasetRegistry.instance = new DatasetRegistry();
    }
    return DatasetRegistry.instance;
  }

  /**
   * Register a getDataset function for a specific dataset ID
   */
  register(datasetId: string, getDataset: GetDatasetFunction): void {
    this.registry.set(datasetId, getDataset);
  }

  /**
   * Set a default getDataset function that will be used when no specific one is registered
   */
  setDefault(getDataset: GetDatasetFunction): void {
    this.defaultGetDataset = getDataset;
  }

  /**
   * Get the getDataset function for a specific dataset ID
   * Falls back to the default if no specific one is registered
   */
  get(datasetId: string): GetDatasetFunction | null {
    return this.registry.get(datasetId) || this.defaultGetDataset;
  }

  /**
   * Remove a registered getDataset function
   */
  unregister(datasetId: string): void {
    this.registry.delete(datasetId);
  }

  /**
   * Clear the default getDataset function
   */
  clearDefault(): void {
    this.defaultGetDataset = null;
  }

  /**
   * Clear all registered functions
   */
  clear(): void {
    this.registry.clear();
    this.defaultGetDataset = null;
  }
}

export const datasetRegistry = DatasetRegistry.getInstance();

