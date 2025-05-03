import { getTool, OnToolCompleted } from '@openassistant/utils';
import { keplergl, KeplerglToolContext } from './map-layer/tool';

export function registerTools() {
  return {
    keplergl,
  };
}

export function getVercelAiTool(
  toolName: string,
  toolContext: KeplerglToolContext,
  onToolCompleted: OnToolCompleted
) {
  const tool = registerTools()[toolName];
  if (!tool) {
    throw new Error(`Tool "${toolName}" not found`);
  }
  return getTool(tool, toolContext, onToolCompleted);
}

export function getVercelTools(
  toolContext: KeplerglToolContext,
  onToolCompleted: OnToolCompleted
) {
  const tools = registerTools();
  return Object.keys(tools).map((key) => {
    return getVercelAiTool(key, toolContext, onToolCompleted);
  });
}
