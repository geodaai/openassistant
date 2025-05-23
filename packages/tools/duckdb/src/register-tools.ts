import { localQuery } from './tool';
import { getTool, OnToolCompleted } from '@openassistant/utils';
import { LocalQueryContext } from './types';

// export the enum of tool names, so users can use it to check if a tool is available
export enum DuckDBToolNames {
  localQuery = 'localQuery',
}

export function registerTools() {
  return {
    localQuery,
  };
}

export function getDuckDBTool(
  toolName: string,
  options: {
    toolContext?: LocalQueryContext;
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

export function getDuckDBTools(
  toolContext: LocalQueryContext,
  onToolCompleted: OnToolCompleted,
  isExecutable: boolean = true
) {
  const tools = registerTools();

  const vercelAiTools = Object.fromEntries(
    Object.keys(tools).map((key) => {
      return [
        key,
        getDuckDBTool(key, { toolContext, onToolCompleted, isExecutable }),
      ];
    })
  );

  return vercelAiTools;
}
