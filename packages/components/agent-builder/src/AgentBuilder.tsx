// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
} from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  MarkerType,
  MiniMap,
  type Edge,
  type ReactFlowInstance,
  type XYPosition,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './index.css';
import clsx from 'clsx';
import { generateId } from '@openassistant/utils';
import { ToolNode } from './components/ToolNode';
import { MetaNode } from './components/MetaNode';
import { AgentBuilderProvider, createNodeDataUpdater } from './context/AgentBuilderContext';
import { buildAgentSchema } from './utils/schema';
import { defaultToolRegistry } from './utils/tool-registry';
import { DEFAULT_CUSTOM_NODES } from './constants';
import type {
  AgentBuilderNode,
  AgentBuilderNodeData,
  AgentBuilderProps,
  AgentBuilderSchema,
  AgentBuilderTool,
  AgentMetaNodeType,
  CustomNodeDefinition,
  DraggedNodeBlueprint,
  ToolNodeData,
  MetaNodeData,
} from './types';

const nodeTypes = {
  toolNode: ToolNode,
  metaNode: MetaNode,
} as const;

const APPLICATION_MIME = 'application/reactflow';

const normalizeTools = (tools: AgentBuilderTool[]) => {
  return tools.map((tool) => ({
    ...tool,
    label: tool.tool.name,
  }));
};

const createNodeFromBlueprint = (
  blueprint: DraggedNodeBlueprint,
  position: XYPosition,
  tools: AgentBuilderTool[],
  customNodes: CustomNodeDefinition[],
  currentNodes: AgentBuilderNode[]
): AgentBuilderNode | null => {
  if (blueprint.kind === 'tool') {
    const tool = tools.find((item) => item.id === blueprint.toolId);
    if (!tool) {
      return null;
    }
    return {
      id: `tool_${tool.id}_${generateId()}`,
      type: 'toolNode',
      position,
      data: {
        label: tool.tool.name,
        description: tool.shortDescription ?? tool.tool.description,
        category: tool.category,
        tool: tool.tool,
      } satisfies ToolNodeData,
    };
  }

  const definition = customNodes.find(
    (node) => node.type === blueprint.metaType
  );

  if (!definition) {
    return null;
  }

  const alreadyExists = currentNodes.some(
    (node) =>
      node.type === 'metaNode' &&
      (node.data as MetaNodeData).type === definition.type
  );

  if (alreadyExists) {
    return null;
  }

  return {
    id: `meta_${definition.type}_${generateId()}`,
    type: 'metaNode',
    position,
    data: {
      label: definition.label,
      description: definition.description,
      placeholder: definition.placeholder,
      type: definition.type,
      value: '',
    } satisfies MetaNodeData,
  };
};

const useGroupedTools = (tools: AgentBuilderTool[], search: string) => {
  return useMemo(() => {
    const lowered = search.toLowerCase();
    const filtered = tools.filter((tool) => {
      if (!lowered) {
        return true;
      }
      return (
        tool.tool.name.toLowerCase().includes(lowered) ||
        tool.tool.description.toLowerCase().includes(lowered)
      );
    });
    const groups = filtered.reduce<Record<string, AgentBuilderTool[]>>(
      (acc, tool) => {
        if (!acc[tool.category]) {
          acc[tool.category] = [];
        }
        acc[tool.category].push(tool);
        return acc;
      },
      {}
    );

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, groupedTools]) => ({
        category,
        tools: groupedTools.sort((a, b) =>
          a.tool.name.localeCompare(b.tool.name)
        ),
      }));
  }, [tools, search]);
};

export const AgentBuilder = ({
  tools = defaultToolRegistry,
  customNodes = DEFAULT_CUSTOM_NODES,
  initialNodes = [],
  initialEdges = [],
  onCreateAgent,
}: AgentBuilderProps) => {
  const normalizedTools = useMemo(() => normalizeTools(tools), [tools]);
  const [nodes, setNodes, onNodesChange] =
    useNodesState<AgentBuilderNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [search, setSearch] = useState('');
  const [schemaPreview, setSchemaPreview] = useState<AgentBuilderSchema | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const groupedTools = useGroupedTools(normalizedTools, search);

  const onConnect = useCallback(
    (connection: Connection | Edge) => {
      setEdges((current) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 2 },
          },
          current
        )
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }
      const raw = event.dataTransfer.getData(APPLICATION_MIME);
      if (!raw) {
        return;
      }

      let blueprint: DraggedNodeBlueprint | null = null;
      try {
        blueprint = JSON.parse(raw) as DraggedNodeBlueprint;
      } catch {
        return;
      }

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      const newNode = createNodeFromBlueprint(
        blueprint,
        position,
        normalizedTools,
        customNodes,
        nodes
      );

      if (!newNode) {
        setErrorMessage(
          blueprint.kind === 'meta'
            ? 'This custom node already exists.'
            : 'Unable to add this node.'
        );
        return;
      }

      setErrorMessage(null);
      setNodes((current) => current.concat(newNode));
    },
    [
      customNodes,
      normalizedTools,
      nodes,
      reactFlowInstance,
      setNodes,
      setErrorMessage,
    ]
  );

  const handleDragStart =
    (payload: DraggedNodeBlueprint) => (event: DragEvent<HTMLButtonElement>) => {
      event.dataTransfer.setData(APPLICATION_MIME, JSON.stringify(payload));
      event.dataTransfer.effectAllowed = 'move';
    };

  const handleCreateAgent = useCallback(() => {
    try {
      const schema = buildAgentSchema(nodes, edges);
      setSchemaPreview(schema);
      setErrorMessage(null);
      onCreateAgent?.(schema);
    } catch (error) {
      setSchemaPreview(null);
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to build agent schema.'
      );
    }
  }, [edges, nodes, onCreateAgent]);

  const updateNodeData = useMemo(
    () => createNodeDataUpdater(setNodes),
    [setNodes]
  );

  const isMetaNodeUsed = useCallback(
    (type: AgentMetaNodeType) => {
      return nodes.some(
        (node) =>
          node.type === 'metaNode' && (node.data as MetaNodeData).type === type
      );
    },
    [nodes]
  );

  const handleNodeShortcut = (
    payload: DraggedNodeBlueprint,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!reactFlowInstance) {
      return;
    }
    const position = reactFlowInstance.project({ x: 120, y: 80 });
    const newNode = createNodeFromBlueprint(
      payload,
      position,
      normalizedTools,
      customNodes,
      nodes
    );
    if (!newNode) {
      setErrorMessage(
        payload.kind === 'meta'
          ? 'This custom node already exists.'
          : 'Unable to add this node.'
      );
      return;
    }
    setErrorMessage(null);
    setNodes((current) => current.concat(newNode));
  };

  const nodeShortcutHandler =
    (payload: DraggedNodeBlueprint) => (event: MouseEvent<HTMLButtonElement>) =>
      handleNodeShortcut(payload, event);

  return (
    <AgentBuilderProvider value={{ updateNodeData }}>
      <div className="agent-builder-grid h-full w-full bg-slate-950 text-slate-100">
        <div className="flex h-full">
          <aside className="flex w-[360px] flex-col border-r border-white/10 bg-slate-900/60 backdrop-blur">
            <div className="border-b border-white/5 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                Agent Builder
              </p>
              <h1 className="mt-1 text-xl font-semibold text-white">
                Orchestrate OpenAssistant Tools
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Drag tools & custom nodes to describe how the agent should
                behave. Connect nodes to express execution order.
              </p>
            </div>

            <div className="px-5 py-4">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Search tools
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Bubble chart, Moran scatter..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-4">
              <div className="space-y-4">
                {groupedTools.map(({ category, tools: categoryTools }) => (
                  <div
                    key={category}
                    className="rounded-2xl border border-white/5 bg-white/5 p-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {category}
                    </p>
                    <div className="mt-3 space-y-2">
                      {categoryTools.map((tool) => (
                        <button
                          key={tool.id}
                          className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-3 text-left text-sm text-white transition hover:border-indigo-400 hover:bg-slate-900"
                          draggable
                          onDragStart={handleDragStart({
                            kind: 'tool',
                            toolId: tool.id,
                          })}
                          onClick={nodeShortcutHandler({
                            kind: 'tool',
                            toolId: tool.id,
                          })}
                        >
                          <p className="font-medium">{tool.tool.name}</p>
                          <p className="text-xs text-slate-400">
                            {tool.shortDescription}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-amber-500/30 bg-amber-50/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                    Custom Nodes
                  </p>
                  <div className="mt-3 space-y-2">
                    {customNodes.map((node) => {
                      const disabled = isMetaNodeUsed(node.type);
                      return (
                        <button
                          key={node.type}
                          className={clsx(
                            'w-full rounded-xl border px-3 py-3 text-left text-sm transition',
                            disabled
                              ? 'cursor-not-allowed border-white/10 bg-white/5 text-slate-500'
                              : 'border-amber-500/40 bg-amber-500/10 text-amber-50 hover:border-amber-400 hover:bg-amber-500/20'
                          )}
                          disabled={disabled}
                          draggable={!disabled}
                          onDragStart={
                            disabled
                              ? undefined
                              : handleDragStart({
                                  kind: 'meta',
                                  metaType: node.type,
                                })
                          }
                          onClick={
                            disabled
                              ? undefined
                              : nodeShortcutHandler({
                                  kind: 'meta',
                                  metaType: node.type,
                                })
                          }
                        >
                          <p className="font-medium">{node.label}</p>
                          <p className="text-xs opacity-80">{node.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 px-5 py-4">
              <button
                type="button"
                onClick={handleCreateAgent}
                className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Create Agent
              </button>
              {errorMessage && (
                <p className="mt-2 text-xs text-rose-300">{errorMessage}</p>
              )}
              {schemaPreview && (
                <div className="mt-3 max-h-48 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-[11px] text-slate-200">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(schemaPreview, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </aside>

          <div className="flex-1">
            <div
              className="h-full"
              ref={reactFlowWrapper}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                proOptions={{ hideAttribution: true }}
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#6366f1',
                  },
                }}
                onInit={setReactFlowInstance}
                fitView
                minZoom={0.5}
                maxZoom={2}
                panOnScroll
                className="bg-slate-950"
              >
                <Background gap={24} size={1} color="#1e293b" />
                <Controls className="rounded-2xl bg-slate-900/70 text-white" />
                <MiniMap
                  pannable
                  zoomable
                  className="rounded-2xl bg-slate-800/80"
                  nodeStrokeColor={(node) =>
                    node.type === 'metaNode' ? '#fbbf24' : '#6366f1'
                  }
                  nodeColor={(node) =>
                    node.type === 'metaNode' ? '#fef3c7' : '#eef2ff'
                  }
                />
              </ReactFlow>
            </div>
          </div>
        </div>
      </div>
    </AgentBuilderProvider>
  );
};
