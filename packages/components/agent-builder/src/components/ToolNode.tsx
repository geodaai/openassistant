// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import type { ToolNodeData } from '../types';

export const ToolNode = ({ data }: NodeProps<ToolNodeData>) => {
  return (
    <div className="min-w-[220px] max-w-sm rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
        <p className="text-sm font-semibold">{data.label}</p>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {data.category}
        </span>
      </div>
      <p className="px-4 py-3 text-xs text-slate-600">{data.description}</p>

      <Handle
        type="target"
        position={Position.Left}
        className="h-3 w-3 rounded-full border-2 border-white bg-slate-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="h-3 w-3 rounded-full border-2 border-white bg-indigo-500"
      />
    </div>
  );
};
