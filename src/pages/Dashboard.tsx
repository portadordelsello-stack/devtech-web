import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { LogOut, Plus, Settings, Briefcase, FileText, Bot } from 'lucide-react';
import { ChatModal } from '../components/ChatModal';

export default function Dashboard({ user }: { user: any }) {
  const isAdmin = user?.email === 'portadordelsello@gmail.com';
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Forms
  const [showCreate, setShowCreate] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState(user?.displayName || '');
  const [showAdminConfig, setShowAdminConfig] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`, auth);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = isAdmin 
      ? collection(db, 'projects')
      : query(collection(db, 'projects'), where('ownerId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(projData);
      setLoadingProjects(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects', auth);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleUpdateProfileAndCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      // Create user profile if none exists
      if (!profile) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          email: user.email,
          name: name,
          phone: phone,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setProfile({ email: user.email, name, phone });
      }

      // Create project
      const projRef = doc(collection(db, 'projects'));
      await setDoc(projRef, {
        name: newProjectName,
        ownerId: user.uid,
        status: 'draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setShowCreate(false);
      setNewProjectName('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users/projects', auth);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  if (loadingProfile || loadingProjects) {
    return <div className="h-screen flex items-center justify-center">Cargando datos...</div>;
  }

  // If client hasn't created any project and profile might be missing
  if (!isAdmin && projects.length === 0 && !showCreate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Bienvenido a DevTech</h2>
          <p className="text-slate-500 mb-6 font-medium text-sm">Para iniciar, cuéntanos un poco sobre ti y el proyecto.</p>
          <form onSubmit={handleUpdateProfileAndCreateProject} className="space-y-4">
            {!profile && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tu Nombre</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-xl" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded-xl" required />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Proyecto</label>
              <input type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} className="w-full px-4 py-2 border rounded-xl" required placeholder="Ej: App de Delivery" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition">
              Crear Proyecto
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-xl">DevTech {isAdmin && <span className="text-indigo-600 border border-indigo-200 bg-indigo-50 px-2 py-0.5 rounded-md text-xs ml-2">ADMIN</span>}</div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600">{user.email}</span>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"><LogOut className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar / Tools */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-500">Herramientas</h3>
            {!isAdmin ? (
              <button onClick={() => setIsChatOpen(true)} className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-indigo-50 text-indigo-700 transition font-medium border border-transparent hover:border-indigo-100">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
                Asistente de Proyectos
              </button>
            ) : (
              <button 
                onClick={() => setShowAdminConfig(!showAdminConfig)} 
                className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-slate-50 text-slate-700 transition font-medium"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                   <Settings className="w-5 h-5" />
                </div>
                Configuración Vertex IA
              </button>
            )}
          </div>

          {isAdmin && showAdminConfig && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <AdminConfigForm />
            </div>
          )}
        </div>

        {/* Main Panel */}
        <div className="md:col-span-2 space-y-6">
           <div className="mb-2">
             <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Consola de Proyectos</h2>
             <p className="text-slate-500 font-medium">
               {isAdmin 
                 ? 'Panel de administración general de requerimientos y desarrollos globales.' 
                 : 'Administra tus aplicaciones y supervisa el avance de tus desarrollos.'}
             </p>
           </div>
           
           <div className="flex items-center justify-between mt-8">
              <h3 className="text-xl font-bold tracking-tight">Proyectos {isAdmin ? 'Globales' : 'Activos'}</h3>
              {!isAdmin && (
                <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition">
                  <Plus className="w-4 h-4" /> Nuevo Proyecto
                </button>
              )}
           </div>

           {showCreate && !isAdmin && (
              <form onSubmit={handleUpdateProfileAndCreateProject} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-end gap-4">
                 <div className="flex-1">
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
                   <input type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-slate-50" placeholder="Nuevo requerimiento" autoFocus required />
                 </div>
                 <button type="submit" className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-indigo-700 transition h-[42px] mb-[1px]">Guardar</button>
                 <button type="button" onClick={() => setShowCreate(false)} className="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-xl h-[42px]">Cancelar</button>
              </form>
           )}

           <div className="space-y-4">
             {projects.length === 0 && !showCreate && (
               <div className="bg-slate-100/50 border border-dashed border-slate-300 rounded-2xl p-10 text-center">
                 <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                 <p className="text-slate-500 font-medium">No hay proyectos actualmente.</p>
               </div>
             )}
             {projects.map(p => (
               <div key={p.id} className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-indigo-200 transition-colors cursor-default flex items-center justify-between">
                 <div>
                   <h3 className="font-bold text-lg">{p.name}</h3>
                   <div className="flex items-center gap-3 mt-2 text-xs font-medium uppercase tracking-widest text-slate-400">
                     <span className={`px-2 py-0.5 rounded-md ${
                       p.status === 'draft' ? 'bg-slate-100 text-slate-600' :
                       p.status === 'pending_quote' ? 'bg-yellow-100 text-yellow-700 font-bold' :
                       'bg-green-100 text-green-700'
                     }`}>
                       {p.status === 'draft' ? 'En Definición' : 
                        p.status === 'pending_quote' ? 'Solicitud de Cotización' : 
                        p.status}
                     </span>
                     {isAdmin && <span>ID: {p.ownerId.slice(0, 8)}...</span>}
                   </div>
                 </div>
                 <Link to={`/project/${p.id}`} className="text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 hidden md:block">
                   Ver Detalles
                 </Link>
               </div>
             ))}
           </div>
        </div>

      </main>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

function AdminConfigForm() {
  const [adminConfig, setAdminConfig] = useState({ apiKey: '', projectId: '', location: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/system-config')
      .then(res => res.json())
      .then(data => {
          setAdminConfig({
              apiKey: data.apiKey || '',
              projectId: data.projectId || '',
              location: data.location || ''
          });
      })
      .catch(err => console.error("Error fetching config:", err));
  }, []);

  const handleSaveAdminConfig = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/system-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminConfig)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-5 bg-indigo-50/30">
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">API Key Vertex AI</label>
          <input 
            type="password" 
            value={adminConfig.apiKey}
            onChange={e => setAdminConfig({...adminConfig, apiKey: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="••••••••••••••••"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Project ID</label>
          <input 
            type="text" 
            value={adminConfig.projectId}
            onChange={e => setAdminConfig({...adminConfig, projectId: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Ej: innate-temple-492815-q9"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vertex Location</label>
          <input 
            type="text" 
            value={adminConfig.location}
            onChange={e => setAdminConfig({...adminConfig, location: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="us-central1"
          />
        </div>
        <button 
          onClick={handleSaveAdminConfig}
          disabled={isSaving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-sm transition mt-2"
        >
          {isSaving ? 'Guardando...' : saveSuccess ? '¡Guardado!' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
