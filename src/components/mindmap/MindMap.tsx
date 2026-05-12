import React, { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';
import { Save, Plus } from 'lucide-react';
import { EditableNode } from './EditableNode';

const initialNodes: Node[] = [
  {
    id: 'root',
    type: 'editable',
    data: { label: 'Mi Negocio / Reto Principal' },
    position: { x: 250, y: 250 }
  },
];

const initialEdges: Edge[] = [];

export function MindMapComponent({ projectId, savedNodes, savedEdges }: { projectId: string, savedNodes?: Node[], savedEdges?: Edge[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(savedNodes?.length ? savedNodes : initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(savedEdges?.length ? savedEdges : initialEdges);
  const [isSaving, setIsSaving] = useState(false);

  const updateNodeLabel = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, label: newLabel };
        }
        return node;
      })
    );
  }, [setNodes]);

  const updateNodeColor = useCallback((nodeId: string, colorId: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, colorId };
        }
        return node;
      })
    );
  }, [setNodes]);

  const nodeTypes = useMemo(() => ({
    editable: EditableNode
  }), []);

  // Sync onChange to node data so it can update its own state if needed, or we just pass it down
  const nodesWithData = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      type: node.type || 'editable',
      data: {
        ...node.data,
        onChange: (evt: React.ChangeEvent<HTMLTextAreaElement>) => updateNodeLabel(node.id, evt.target.value),
        onColorChange: (colorId: string) => updateNodeColor(node.id, colorId)
      }
    }));
  }, [nodes, updateNodeLabel, updateNodeColor]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const addNode = () => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: 'editable',
      data: { label: 'Nueva Idea' },
      position: { x: (Math.random() * 200) + 100, y: (Math.random() * 200) + 100 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const saveMap = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        mindmapNodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: { label: n.data.label, colorId: n.data.colorId } })), // clean out the functions
        mindmapEdges: edges,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${projectId}`, auth);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }} className="relative">
      <ReactFlow
        nodes={nodesWithData}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background gap={16} />
        <Controls />
        <MiniMap zoomable pannable />
        
        <Panel position="top-left" className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-slate-200 m-4 max-w-xs pointer-events-none">
          <h4 className="font-bold text-sm text-slate-800 mb-2">Guía del Mapa</h4>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">Arrastra un enlace desde los puntos de un nodo a otro para conectarlos. Al pasar el mouse sobre un nodo, puedes cambiar su color:</p>
          <ul className="text-xs space-y-2">
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-200 border border-rose-400"></span><span className="text-slate-600"><strong>Dolor:</strong> El problema del cliente (Ej: Entregas tarde)</span></li>
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-200 border border-emerald-400"></span><span className="text-slate-600"><strong>Solución:</strong> Qué haremos (Ej: App de rastreo)</span></li>
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-200 border border-amber-400"></span><span className="text-slate-600"><strong>Beneficio:</strong> Qué ganamos (Ej: Cero quejas)</span></li>
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-violet-200 border border-violet-400"></span><span className="text-slate-600"><strong>Métrica:</strong> Cómo lo medimos (Ej: Tiempo de envío)</span></li>
          </ul>
        </Panel>

        <Panel position="top-right" className="flex gap-2">
          <button 
            onClick={addNode}
            className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition font-medium"
          >
            <Plus className="w-4 h-4" />
            Añadir Nodo
          </button>
          <button 
            onClick={saveMap}
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-indigo-700 transition font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
