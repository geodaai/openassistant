// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import type { MetaNodeData } from '../types';
import { useAgentBuilder } from '../context/AgentBuilderContext';

export const MetaNode = ({ id, data }: NodeProps<MetaNodeData>) => {
  const { updateNodeData } = useAgentBuilder();

  return (
    <div className="w-72 rounded-2xl border border-amber-200 bg-white/90 text-slate-900 shadow-lg backdrop-blur">
      <div className="border-b border-amber-100 px-4 py-2">
        <p className="text-sm font-semibold text-amber-900">{data.label}</p>
        <p className="text-xs text-slate-500">{data.description}</p>
      </div>
      <textarea
        value={data.value}
        placeholder={data.placeholder}
        onChange={(event) =>
          updateNodeData(id, (current) => ({
            ...current,
            value: event.target.value,
          }))
        }
        className="h-28 w-full resize-none rounded-b-2xl bg-transparent px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-amber-400"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="h-3 w-3 rounded-full border-2 border-white bg-amber-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="h-3 w-3 rounded-full border-2 border-white bg-amber-500"
      />
    </div>
  );
};
