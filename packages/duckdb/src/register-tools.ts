import { localQuery } from './tool';
import { getTool, OnToolCompleted } from '@openassistant/utils';
import { LocalQueryContext } from './types';

export function registerTools() {
  return {
    localQuery,
  };
}

export function getVercelAiTool(
  toolName: string,
  toolContext: LocalQueryContext,
  onToolCompleted: OnToolCompleted
) {
  const tool = registerTools()[toolName];
  if (!tool) {
    throw new Error(`Tool "${toolName}" not found`);
  }
  return getTool(tool, toolContext, onToolCompleted);
}

export function getVercelAiTools(
  toolContext: LocalQueryContext,
  onToolCompleted: OnToolCompleted
) {
  const tools = registerTools();
  return Object.keys(tools).map((key) => {
    return getVercelAiTool(key, toolContext, onToolCompleted);
  });
}
