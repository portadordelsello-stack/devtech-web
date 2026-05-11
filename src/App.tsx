import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#f5f5f4]">Cargando...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing user={user} />} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
    </Routes>
  );
}
