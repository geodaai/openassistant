// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

export interface MapToolContext {
  getDataset?: (datasetName: string) => Promise<unknown>;
  getGeometries?: (datasetName: string) => Promise<unknown>;
}

export function isMapToolContext(context: unknown): context is MapToolContext {
  return context && (
    typeof context.getDataset === 'function' || 
    typeof context.getGeometries === 'function'
  );
}