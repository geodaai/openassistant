// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import type { OpenAssistantTool } from '@openassistant/utils';
import * as DuckdbTools from '@openassistant/duckdb';
import * as GeodaTools from '@openassistant/geoda';
import * as H3Tools from '@openassistant/h3';
import * as MapTools from '@openassistant/map';
import * as OsmTools from '@openassistant/osm';
import * as PlacesTools from '@openassistant/places';
import * as PlotTools from '@openassistant/plots';
import type { AgentBuilderTool } from '../types';

type ToolModule = {
  category: string;
  module: Record<string, unknown>;
};

const MODULES: ToolModule[] = [
  { category: 'DuckDB', module: DuckdbTools },
  { category: 'Spatial Analysis', module: GeodaTools },
  { category: 'H3', module: H3Tools },
  { category: 'Mapping', module: MapTools },
  { category: 'OSM', module: OsmTools },
  { category: 'Places', module: PlacesTools },
  { category: 'Visualization', module: PlotTools },
];

const isOpenAssistantTool = (
  candidate: unknown
): candidate is OpenAssistantTool => {
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    'name' in candidate &&
    'description' in candidate &&
    'parameters' in candidate &&
    'execute' in candidate &&
    typeof (candidate as OpenAssistantTool).execute === 'function'
  );
};

export const defaultToolRegistry: AgentBuilderTool[] = (() => {
  const deduped = new Map<string, AgentBuilderTool>();

  MODULES.forEach(({ category, module }) => {
    Object.values(module)
      .filter(isOpenAssistantTool)
      .forEach((tool) => {
        if (!deduped.has(tool.name)) {
          deduped.set(tool.name, {
            id: tool.name,
            category,
            tool,
            shortDescription: tool.description,
          });
        }
      });
  });

  return Array.from(deduped.values()).sort((a, b) => {
    if (a.category === b.category) {
      return a.tool.name.localeCompare(b.tool.name);
    }
    return a.category.localeCompare(b.category);
  });
})();
