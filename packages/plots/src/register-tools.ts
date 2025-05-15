import { boxplot } from './echarts/boxplot/tool';
import { bubbleChart } from './echarts/bubble-chart/tool';
import { histogram } from './echarts/histogram/tool';
import { pcp } from './echarts/pcp/tool';
import { scatterplot } from './echarts/scatterplot/tool';
import { vegaLitePlot } from './vegalite/tool';
import { getTool, OnToolCompleted } from '@openassistant/utils';
import { GetValues, OnSelected } from './types';

// export the enum of tool names, so users can use it to check if a tool is available
export enum PlotsToolNames {
  boxplot = 'boxplot',
  bubbleChart = 'bubbleChart',
  histogram = 'histogram',
  pcp = 'pcp',
  scatterplot = 'scatterplot',
  vegaLitePlot = 'vegaLitePlot',
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
    vegaLitePlot,
  };
}

export function getPlotsTool(
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

export function getPlotsTools(
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
        getPlotsTool(key, { toolContext, onToolCompleted, isExecutable }),
      ];
    })
  );

  return toolsResult;
}
