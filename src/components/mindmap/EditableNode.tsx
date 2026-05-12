import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const EditableNode = memo(({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-white border-2 border-indigo-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-400 transition min-w-[150px] overflow-hidden group">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500" />
      <div className="p-2">
        <input 
          className="w-full text-center font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded px-1 py-1 text-slate-800"
          value={data.label}
          onChange={data.onChange}
          placeholder="Escribe algo..."
        />
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500" />
      <Handle type="source" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500" id="left" />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500" id="right" />
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500" id="tgt-left" />
      <Handle type="target" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500" id="tgt-right" />
    </div>
  );
});
