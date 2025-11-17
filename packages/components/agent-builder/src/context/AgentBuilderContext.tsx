// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  createContext,
  useContext,
  type PropsWithChildren,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { AgentBuilderNode } from '../types';

type AgentBuilderContextValue = {
  updateNodeData: (
    nodeId: string,
    updater: (data: AgentBuilderNode['data']) => AgentBuilderNode['data']
  ) => void;
};

const AgentBuilderContext = createContext<AgentBuilderContextValue | null>(null);

type AgentBuilderProviderProps = PropsWithChildren<{
  value: AgentBuilderContextValue;
}>;

export const AgentBuilderProvider = ({
  children,
  value,
}: AgentBuilderProviderProps) => {
  return (
    <AgentBuilderContext.Provider value={value}>
      {children}
    </AgentBuilderContext.Provider>
  );
};

export const useAgentBuilder = () => {
  const ctx = useContext(AgentBuilderContext);
  if (!ctx) {
    throw new Error(
      'useAgentBuilder must be used within an AgentBuilderProvider.'
    );
  }
  return ctx;
};

export const createNodeDataUpdater =
  (
    setNodes: Dispatch<SetStateAction<AgentBuilderNode[]>>
  ) =>
  (
    nodeId: string,
    updater: (data: AgentBuilderNode['data']) => AgentBuilderNode['data']
  ) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== nodeId) {
          return node;
        }
        return {
          ...node,
          data: updater(node.data),
        };
      })
    );
  };
