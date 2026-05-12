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
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';
import { Save, Plus } from 'lucide-react';
import { EditableNode } from './EditableNode';

const initialNodes: Node[] = [
  {
    id: 'root',
    type: 'editable',
    data: { label: 'Idea Central' },
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
        onChange: (evt: React.ChangeEvent<HTMLInputElement>) => updateNodeLabel(node.id, evt.target.value)
      }
    }));
  }, [nodes, updateNodeLabel]);

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
        mindmapNodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: { label: n.data.label } })), // clean out the onChange function
        mindmapEdges: edges,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${projectId}`);
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
