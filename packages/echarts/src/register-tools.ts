import { boxplot } from './boxplot/tool';
import { bubbleChart } from './bubble-chart/tool';
import { histogram } from './histogram/tool';
import { pcp } from './pcp/tool';
import { scatterplot } from './scatterplot/tool';

import { getTool, OnToolCompleted } from '@openassistant/utils';
import { GetValues, OnSelected } from './types';

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

export function getVercelAiTool(
  toolName: string,
  toolContext: ToolContext,
  onToolCompleted: OnToolCompleted
) {
  const tool = registerTools()[toolName];
  if (!tool) {
    throw new Error(`Tool "${toolName}" not found`);
  }
  return getTool(tool, toolContext, onToolCompleted);
}

export function getVercelAiTools(
  toolContext: ToolContext,
  onToolCompleted: OnToolCompleted
) {
  const tools = registerTools();

  // return Record<string, ToolResult>
  const toolsResult = Object.fromEntries(
    Object.keys(tools).map((key) => {
      return [key, getVercelAiTool(key, toolContext, onToolCompleted)];
    })
  );

  console.log('toolsResult', toolsResult);
  return toolsResult;
}
