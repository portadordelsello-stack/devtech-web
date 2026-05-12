import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const COLORS = [
  { id: 'default', bg: 'bg-white', border: 'border-indigo-200', ring: 'focus:ring-indigo-100', text: 'text-slate-800', tooltip: 'Idea General' },
  { id: 'problem', bg: 'bg-rose-50', border: 'border-rose-300', ring: 'focus:ring-rose-200', text: 'text-rose-900', tooltip: 'Dolor / Problema' },
  { id: 'solution', bg: 'bg-emerald-50', border: 'border-emerald-300', ring: 'focus:ring-emerald-200', text: 'text-emerald-900', tooltip: 'Solución / Acción' },
  { id: 'result', bg: 'bg-amber-50', border: 'border-amber-300', ring: 'focus:ring-amber-200', text: 'text-amber-900', tooltip: 'Beneficio / Resultado' },
  { id: 'metric', bg: 'bg-violet-50', border: 'border-violet-300', ring: 'focus:ring-violet-200', text: 'text-violet-900', tooltip: 'Métrica de Éxito' },
];

export const EditableNode = memo(({ data, isConnectable }: NodeProps) => {
  const currentColor = COLORS.find(c => c.id === data.colorId) || COLORS[0];

  return (
    <div className={`${currentColor.bg} border-2 ${currentColor.border} rounded-xl shadow-sm hover:shadow-md transition min-w-[150px] overflow-hidden group relative`}>
      {/* Node Type Color Picker (visible on hover) */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-md rounded-lg p-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
        {COLORS.map(color => (
          <button
            key={color.id}
            title={color.tooltip}
            onClick={() => data.onColorChange && data.onColorChange(color.id)}
            className={`w-5 h-5 rounded-full border ${color.bg} ${color.border} hover:scale-110 transition-transform`}
          />
        ))}
      </div>

      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-3">
        <textarea 
          className={`w-full text-center font-medium bg-transparent border-none focus:outline-none focus:ring-2 ${currentColor.ring} rounded px-1 py-1 ${currentColor.text} resize-none overflow-hidden`}
          value={data.label}
          onChange={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
            data.onChange(e);
          }}
          placeholder="Escribe algo..."
          rows={1}
          style={{ height: 'auto', minHeight: '1.5rem' }}
        />
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" id="left" />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" id="right" />
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" id="tgt-left" />
      <Handle type="target" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" id="tgt-right" />
    </div>
  );
});
