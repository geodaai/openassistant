import { boxplot } from './boxplot/tool';
import { bubbleChart } from './bubble-chart/tool';
import { histogram } from './histogram/tool';
import { pcp } from './pcp/tool';
import { scatterplot } from './scatterplot/tool';

import { getTool, OnToolCompleted } from '@openassistant/utils';
import { GetValues, OnSelected } from './types';

// export the enum of tool names, so users can use it to check if a tool is available
export enum EChartsToolNames {
  boxplot = 'boxplot',
  bubbleChart = 'bubbleChart',
  histogram = 'histogram',
  pcp = 'pcp',
  scatterplot = 'scatterplot',
}

export type ToolContext = {
  getValues: GetValues;
  onSelected?: OnSelected;
};

export function registerTools() {
  return {
    boxplot,
    bubbleChart,
    histogram,
    pcp,
    scatterplot,
  };
}

export function getEChartsTool(
  toolName: string,
  options: {
    toolContext?: ToolContext;
    onToolCompleted?: OnToolCompleted;
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

export function getEChartsTools(
  toolContext: ToolContext,
  onToolCompleted: OnToolCompleted,
  isExecutable: boolean = true
) {
  const tools = registerTools();

  // return Record<string, ToolResult>
  const toolsResult = Object.fromEntries(
    Object.keys(tools).map((key) => {
      return [
        key,
        getEChartsTool(key, { toolContext, onToolCompleted, isExecutable }),
      ];
    })
  );

  return toolsResult;
}
