// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import type { OpenAssistantTool } from '@openassistant/utils';
import type { Node, Edge } from 'reactflow';
import type { JsonSchema7Type } from 'zod-to-json-schema';

export type AgentMetaNodeType = 'agentName' | 'agentDescription' | 'agentResult' | 'agentError';

export type CustomNodeDefinition = {
  type: AgentMetaNodeType;
  label: string;
  description: string;
  placeholder: string;
};

export type AgentBuilderTool = {
  id: string;
  category: string;
  group?: string;
  tool: OpenAssistantTool;
  shortDescription?: string;
};

export type ToolNodeData = {
  label: string;
  description: string;
  category: string;
  tool: OpenAssistantTool;
};

export type MetaNodeData = {
  label: string;
  description: string;
  placeholder: string;
  type: AgentMetaNodeType;
  value: string;
};

export type AgentBuilderNodeData = ToolNodeData | MetaNodeData;
export type AgentBuilderNode = Node<AgentBuilderNodeData>;

export type AgentBuilderEdge = Edge;

export type AgentBuilderSchema = {
  agent: {
    name?: string;
    description?: string;
    result?: string;
    error?: string;
  };
  workflow: {
    order: string[];
    edges: Array<Pick<Edge, 'id' | 'source' | 'target'>>;
    adjacency: Record<string, string[]>;
  };
  tools: Array<{
    nodeId: string;
    name: string;
    description: string;
    parametersSchema?: JsonSchema7Type;
  }>;
  customNodes: Array<{
    nodeId: string;
    type: AgentMetaNodeType;
    value: string;
  }>;
};

export type AgentBuilderProps = {
  tools?: AgentBuilderTool[];
  customNodes?: CustomNodeDefinition[];
  initialNodes?: AgentBuilderNode[];
  initialEdges?: AgentBuilderEdge[];
  onCreateAgent?: (schema: AgentBuilderSchema) => void;
};

export type DraggedNodeBlueprint =
  | {
      kind: 'tool';
      toolId: string;
    }
  | {
      kind: 'meta';
      metaType: AgentMetaNodeType;
    };
