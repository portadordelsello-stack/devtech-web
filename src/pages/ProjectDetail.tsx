import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { Bot, ArrowLeft, BrainCircuit, CheckSquare, DollarSign, Send, User, Loader2, Save } from 'lucide-react';
import { ChatWidget } from '../components/ChatModal';

type TaskStatus = 'backlog' | 'todo' | 'inprogress' | 'done';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export default function ProjectDetail({ user }: { user: any }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = user?.email === 'portadordelsello@gmail.com';
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'kanban' | 'budget' | 'admin'>('kanban');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [budgetEstimate, setBudgetEstimate] = useState<string | null>(null);
  const [isLoadingBudget, setIsLoadingBudget] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.ownerId !== user.uid && user.email !== 'portadordelsello@gmail.com') {
            navigate('/dashboard'); // unauthorized
            return;
          }
          setProject({ id: snap.id, ...data });
          
          if (data.tasks) {
            setTasks(data.tasks);
          }
          
          if (data.budgetEstimate) {
            setBudgetEstimate(data.budgetEstimate);
          }
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `projects/${id}`, auth);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, user, navigate]);

  const handleEstimateBudget = async () => {
    if (!id || tasks.length === 0) {
      alert("Por favor, añade algunas tareas al Roadmap primero.");
      return;
    }
    
    setIsLoadingBudget(true);
    try {
      const response = await fetch('/api/estimate-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, projectName: project?.name }),
      });

      if (!response.ok) throw new Error('Error al estimar presupuesto');
      const data = await response.json();
      
      setBudgetEstimate(data.estimate);
      
      await updateDoc(doc(db, 'projects', id), {
        budgetEstimate: data.estimate,
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al estimar el presupuesto.");
    } finally {
      setIsLoadingBudget(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !id) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: '',
      status: 'backlog'
    };
    
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    setNewTaskTitle('');
    
    try {
      await updateDoc(doc(db, 'projects', id), { 
        tasks: newTasks,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving task", error);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && id) {
      const newTasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
      setTasks(newTasks);
      try {
        await updateDoc(doc(db, 'projects', id), { 
          tasks: newTasks,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
         console.error("Error updating task status", error);
      }
    }
  };

  const columns: { id: TaskStatus, title: string }[] = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link to="/dashboard" className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-bold text-xl text-slate-800">{project?.name}</h1>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5">Espacio de Trabajo del Proyecto</p>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-80 flex flex-col gap-4 shrink-0 h-[75vh] min-h-[500px]">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-slate-500">Módulos Activos</h3>
            
            <button 
              onClick={() => setActiveTab('kanban')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition font-medium text-sm border mt-1 ${
                activeTab === 'kanban' 
                  ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                  : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CheckSquare className="w-4 h-4" /> Roadmap
            </button>

            <button 
              onClick={() => setActiveTab('budget')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition font-medium text-sm border mt-1 ${
                activeTab === 'budget' 
                  ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                  : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <DollarSign className="w-4 h-4" /> Presupuesto
            </button>

            {isAdmin && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition font-medium text-sm border mt-1 ${
                  activeTab === 'admin' 
                    ? 'bg-slate-800 border-slate-700 text-white' 
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="w-4 h-4 rounded bg-slate-200 text-slate-800 flex items-center justify-center text-[10px] font-bold">A</div> Admin
              </button>
            )}
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 min-h-[400px] overflow-hidden flex flex-col">
             <ChatWidget title="Asistente de Proyectos" subtitle="Impulsado por Vertex AI" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[75vh] min-h-[500px]">
          {activeTab === 'kanban' && (
            <div className="flex-1 flex flex-col p-6 bg-slate-50/50 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">Roadmap del Proyecto</h3>
                  <p className="text-slate-500 text-sm">Organiza las historias de usuario y tareas de desarrollo.</p>
                </div>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 h-full">
                {columns.map(col => (
                  <div 
                    key={col.id} 
                    className="flex-1 min-w-[280px] bg-slate-100/50 rounded-2xl p-4 flex flex-col border border-slate-200/50"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                  >
                    <div className="flex items-center justify-between mb-4 px-2">
                       <h4 className="font-bold text-sm text-slate-700 uppercase tracking-wider">{col.title}</h4>
                       <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                         {tasks.filter(t => t.status === col.id).length}
                       </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                      {tasks.filter(t => t.status === col.id).map(task => (
                        <div 
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow transition-all"
                        >
                          <h5 className="font-medium text-sm text-slate-800">{task.title}</h5>
                          {task.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{task.description}</p>}
                        </div>
                      ))}
                      
                      {col.id === 'backlog' && (
                        <form onSubmit={handleCreateTask} className="mt-2">
                          <input 
                            type="text" 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="+ Nueva tarea..." 
                            className="text-sm bg-white border border-slate-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                          />
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="flex-1 flex flex-col p-6 bg-slate-50/50 rounded-2xl overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">Estimador de Presupuesto</h3>
                  <p className="text-slate-500 text-sm">Calculado por IA en base a las tareas de tu Roadmap.</p>
                </div>
                <button
                  onClick={handleEstimateBudget}
                  disabled={isLoadingBudget || tasks.length === 0}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-50 disabled:hover:bg-emerald-600 shadow-sm"
                >
                  {isLoadingBudget ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Calculando...</>
                  ) : (
                    <><BrainCircuit className="w-4 h-4" /> Estimar Costo</>
                  )}
                </button>
              </div>

              {budgetEstimate ? (
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 markdown-body prose prose-slate max-w-none text-sm md:text-base">
                  {budgetEstimate.split('\\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.startsWith('#') ? (
                        <strong className="block mt-4 mb-2 text-slate-800 text-lg">{line.replace(/#/g, '').trim()}</strong>
                      ) : line.startsWith('-') ? (
                        <li className="ml-4 text-slate-700">{line.replace('-', '').trim()}</li>
                      ) : line.startsWith('**') ? (
                        <strong className="block mt-4 text-slate-900">{line.replace(/\\*\\*/g, '')}</strong>
                      ) : (
                        <span className="block mb-2 text-slate-600">{line}</span>
                      )}
                    </React.Fragment>
                  ))}
                  
                  <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-indigo-900">¿Estás listo para avanzar?</h4>
                      <p className="text-sm text-indigo-700 mt-1">Solicita una propuesta formal. El equipo de DevTech revisará los requerimientos y te contactará.</p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await updateDoc(doc(db, 'projects', id as string), {
                            status: 'pending_quote',
                            updatedAt: serverTimestamp()
                          });
                          setProject({ ...project, status: 'pending_quote' });
                          alert("¡Solicitud enviada a DevTech correctamente!");
                        } catch(e) {
                          console.error(e);
                        }
                      }}
                      disabled={project?.status === 'pending_quote'}
                      className="whitespace-nowrap px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                      {project?.status === 'pending_quote' ? 'Solicitud Enviada' : 'Solicitar Propuesta'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100 mb-4 text-emerald-600">
                     <DollarSign className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Aún no hay presupuesto</h3>
                  <p className="text-slate-500 max-w-sm text-sm mb-6">Asegúrate de tener tareas definidas en tu Roadmap, luego haz clic en "Estimar Costo" para que la IA genere un presupuesto aproximado.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="flex-1 flex flex-col p-6 bg-slate-50/50 rounded-2xl overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-xl font-bold">Consola de Administración</h3>
                <p className="text-slate-500 text-sm">Gestiona el estado y la configuración de este proyecto.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-lg mb-6">
                 <h4 className="font-bold text-slate-800 mb-4">Estado del Proyecto</h4>
                 <div className="space-y-3">
                   <div className="flex items-center gap-3">
                      <input type="radio" name="status" id="s_draft" checked={project?.status === 'draft'} 
                        onChange={async () => {
                          const newStatus = 'draft';
                          await updateDoc(doc(db, 'projects', id as string), { status: newStatus, updatedAt: serverTimestamp() });
                          setProject({...project, status: newStatus});
                        }} 
                      />
                      <label htmlFor="s_draft" className="font-medium text-slate-700">En Definición (Borrador)</label>
                   </div>
                   <div className="flex items-center gap-3">
                      <input type="radio" name="status" id="s_pending_quote" checked={project?.status === 'pending_quote'}
                        onChange={async () => {
                          const newStatus = 'pending_quote';
                          await updateDoc(doc(db, 'projects', id as string), { status: newStatus, updatedAt: serverTimestamp() });
                          setProject({...project, status: newStatus});
                        }} 
                      />
                      <label htmlFor="s_pending_quote" className="font-medium text-yellow-700">Cotización Solicitada</label>
                   </div>
                   <div className="flex items-center gap-3">
                      <input type="radio" name="status" id="s_in_progress" checked={project?.status === 'in_progress'}
                        onChange={async () => {
                          const newStatus = 'in_progress';
                          await updateDoc(doc(db, 'projects', id as string), { status: newStatus, updatedAt: serverTimestamp() });
                          setProject({...project, status: newStatus});
                        }} 
                      />
                      <label htmlFor="s_in_progress" className="font-medium text-blue-700">En Desarrollo</label>
                   </div>
                   <div className="flex items-center gap-3">
                      <input type="radio" name="status" id="s_completed" checked={project?.status === 'completed'}
                        onChange={async () => {
                          const newStatus = 'completed';
                          await updateDoc(doc(db, 'projects', id as string), { status: newStatus, updatedAt: serverTimestamp() });
                          setProject({...project, status: newStatus});
                        }} 
                      />
                      <label htmlFor="s_completed" className="font-medium text-green-700">Completado</label>
                   </div>
                 </div>
              </div>
              
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm max-w-lg text-white">
                <h4 className="font-bold mb-2">Detalles Internos</h4>
                <div className="text-xs space-y-2 opacity-80">
                  <p><span className="font-bold">Project ID:</span> {project?.id}</p>
                  <p><span className="font-bold">Owner ID:</span> {project?.ownerId}</p>
                  <p><span className="font-bold">Última Actualización:</span> {project?.updatedAt?.toDate ? project?.updatedAt?.toDate().toLocaleString() : 'Reciente'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
