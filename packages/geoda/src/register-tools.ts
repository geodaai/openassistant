import { getTool, OnToolCompleted } from '@openassistant/utils';
import { SpatialToolContext } from './types';

import { dataClassify } from './data-classify/tool';
import { lisa } from './lisa/tool';
import { globalMoran } from './moran-scatterplot/tool';
import { spatialRegression } from './regression/tool';
import { spatialJoin } from './spatial_join/tool';
import { spatialFilter } from './spatial_join/spatial-filter';
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
    spatialFilter,
    spatialWeights,
    area,
    buffer,
    centroid,
    dissolve,
    length,
    perimeter,
  };
}

export function getGeoDaTool(
  toolName: string,
  options: {
    toolContext: SpatialToolContext;
    onToolCompleted: OnToolCompleted;
    isExecutable?: boolean;
  }
) {
  const tool = registerTools()[toolName];
  if (!tool) {
    throw new Error(`Tool "${toolName}" not found`);
  }
  return getTool({
    tool,
    options: {
      ...options,
      isExecutable: options.isExecutable ?? true,
    },
  });
}

export function getGeoDaTools(
  toolContext: SpatialToolContext,
  onToolCompleted: OnToolCompleted,
  isExecutable: boolean = true
) {
  const tools = registerTools();

  const toolsResult = Object.fromEntries(
    Object.keys(tools).map((key) => {
      return [
        key,
        getGeoDaTool(key, {
          toolContext,
          onToolCompleted,
          isExecutable,
        }),
      ];
    })
  );

  return toolsResult;
}
