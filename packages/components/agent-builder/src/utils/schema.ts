// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { zodToJsonSchema } from 'zod-to-json-schema';
import type {
  AgentBuilderEdge,
  AgentBuilderNode,
  AgentBuilderSchema,
  AgentMetaNodeType,
  MetaNodeData,
  ToolNodeData,
} from '../types';

const META_KEY_TO_AGENT_FIELD: Record<AgentMetaNodeType, keyof AgentBuilderSchema['agent']> =
  {
    agentName: 'name',
    agentDescription: 'description',
    agentResult: 'result',
    agentError: 'error',
  };

const mapToObject = (map: Map<string, string[]>): Record<string, string[]> => {
  const output: Record<string, string[]> = {};
  map.forEach((value, key) => {
    output[key] = value;
  });
  return output;
};

const buildAdjacency = (
  nodes: AgentBuilderNode[],
  edges: AgentBuilderEdge[]
): Map<string, string[]> => {
  const adjacency = new Map<string, string[]>();
  nodes.forEach((node) => {
    adjacency.set(node.id, []);
  });

  edges.forEach((edge) => {
    const next = adjacency.get(edge.source);
    if (next) {
      next.push(edge.target);
    }
  });

  return adjacency;
};

const createTopologicalOrder = (
  nodes: AgentBuilderNode[],
  edges: AgentBuilderEdge[]
): { order: string[]; adjacency: Record<string, string[]> } => {
  const adjacency = buildAdjacency(nodes, edges);
  const inDegree = new Map<string, number>();
  nodes.forEach((node) => {
    inDegree.set(node.id, 0);
  });

  edges.forEach((edge) => {
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  });

  const queue: string[] = [];
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });

  const order: string[] = [];
  while (queue.length) {
    const nodeId = queue.shift() as string;
    order.push(nodeId);
    adjacency.get(nodeId)?.forEach((nextId) => {
      const updated = (inDegree.get(nextId) ?? 0) - 1;
      inDegree.set(nextId, updated);
      if (updated === 0) {
        queue.push(nextId);
      }
    });
  }

  if (order.length !== nodes.length) {
    throw new Error(
      'The workflow contains a cycle. Break the circular dependency to create an agent.'
    );
  }

  return { order, adjacency: mapToObject(adjacency) };
};

const extractAgentMetadata = (metaNodes: AgentBuilderNode[]) => {
  return metaNodes.reduce<Record<AgentMetaNodeType, string>>((acc, node) => {
    if (node.type !== 'metaNode') {
      return acc;
    }
    const { type, value } = node.data as MetaNodeData;
    acc[type] = value?.trim() ?? '';
    return acc;
  }, {} as Record<AgentMetaNodeType, string>);
};

const serializeToolNode = (node: AgentBuilderNode) => {
  const data = node.data as ToolNodeData;
  return {
    nodeId: node.id,
    name: data.tool.name,
    description: data.tool.description,
    parametersSchema: data.tool.parameters
      ? (zodToJsonSchema(data.tool.parameters, {
          target: 'jsonSchema7',
          name: `${data.tool.name}Parameters`,
        }) as AgentBuilderSchema['tools'][number]['parametersSchema'])
      : undefined,
  };
};

const serializeMetaNode = (node: AgentBuilderNode) => {
  const data = node.data as MetaNodeData;
  return {
    nodeId: node.id,
    type: data.type,
    value: data.value,
  };
};

export const buildAgentSchema = (
  nodes: AgentBuilderNode[],
  edges: AgentBuilderEdge[]
): AgentBuilderSchema => {
  if (!nodes.length) {
    throw new Error('Add at least one node to describe the agent.');
  }

  const { order, adjacency } = createTopologicalOrder(nodes, edges);
  const metaNodes = nodes.filter((node) => node.type === 'metaNode');
  const toolNodes = nodes.filter((node) => node.type === 'toolNode');
  const metadata = extractAgentMetadata(metaNodes);

  const agent: AgentBuilderSchema['agent'] = Object.entries(
    META_KEY_TO_AGENT_FIELD
  ).reduce((acc, [metaKey, fieldKey]) => {
    const key = metaKey as AgentMetaNodeType;
    acc[fieldKey] = metadata[key];
    return acc;
  }, {} as AgentBuilderSchema['agent']);

  return {
    agent,
    workflow: {
      order,
      edges: edges.map(({ id, source, target }) => ({ id, source, target })),
      adjacency,
    },
    tools: toolNodes.map(serializeToolNode),
    customNodes: metaNodes.map(serializeMetaNode),
  };
};
