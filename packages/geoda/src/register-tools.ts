import { getTool, OnToolCompleted } from '@openassistant/utils';
import { SpatialToolContext } from './types';

import { dataClassify } from './data-classify/tool';
import { lisa } from './lisa/tool';
import { globalMoran } from './moran-scatterplot/tool';
import { spatialRegression } from './regression/tool';
import { spatialJoin } from './spatial_join/tool';
import { spatialWeights } from './weights/tool';
import { area } from './spatial_ops/area';
import { buffer } from './spatial_ops/buffer';
import { centroid } from './spatial_ops/centroid';
import { dissolve } from './spatial_ops/dissolve';
import { length } from './spatial_ops/length';
import { perimeter } from './spatial_ops/perimeter';

export function registerTools() {
  return {
    dataClassify,
    lisa,
    globalMoran,
    spatialRegression,
    spatialJoin,
    spatialWeights,
    area,
    buffer,
    centroid,
    dissolve,
    length,
    perimeter,
  };
}

export function getVercelAiTool(
  toolName: string,
  toolContext: SpatialToolContext,
  onToolCompleted: OnToolCompleted
) {
  const tool = registerTools()[toolName];
  if (!tool) {
    throw new Error(`Tool "${toolName}" not found`);
  }
  return getTool(tool, toolContext, onToolCompleted);
}

export function getVercelTools(
  toolContext: SpatialToolContext,
  onToolCompleted: OnToolCompleted
) {
  const tools = registerTools();
  return Object.keys(tools).map((key) => {
    return getVercelAiTool(key, toolContext, onToolCompleted);
  });
}
