// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

export interface OsmToolContext {
  getGeometries?: (datasetName: string) => Promise<unknown>;
}

export function isOsmToolContext(context: unknown): context is OsmToolContext {
  return context && typeof context.getGeometries === 'function';
}

export interface MapboxToolContext {
  getMapboxToken: () => string;
}

export function isMapboxToolContext(context: unknown): context is MapboxToolContext {
  return context && typeof context.getMapboxToken === 'function';
}