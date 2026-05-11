import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  BrainCircuit,
  Database,
  ArrowRight,
  Menu,
  X,
  Globe,
  HeartPulse,
  Sparkles
} from 'lucide-react';
import { ChatModal } from '../components/ChatModal';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export default function Landing({ user }: { user: any }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    if (user) {
      navigate('/dashboard');
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#f5f5f4] flex items-center justify-center"
          >
            <div className="flex flex-col items-center">
               <motion.div 
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 className="text-black font-bold text-4xl tracking-tighter"
               >
                 DevTech.
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#f5f5f4] text-[#0a0a0a] font-sans selection:bg-black selection:text-white flex flex-col relative overflow-hidden">
        
        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-[#f5f5f4]/80 backdrop-blur-md border-b border-black/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tighter">DevTech.</div>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
              <a href="#services" className="hover:text-gray-500 transition-colors uppercase text-[11px] tracking-widest">Soluciones</a>
              <a href="#methodology" className="hover:text-gray-500 transition-colors uppercase text-[11px] tracking-widest">Metodología</a>
              <a href="#initiatives" className="hover:text-gray-500 transition-colors uppercase text-[11px] tracking-widest">Iniciativas</a>
              <a href="#whyus" className="hover:text-gray-500 transition-colors uppercase text-[11px] tracking-widest">Por Qué DevTech</a>
              <button 
                onClick={handleLogin}
                className="px-6 py-2.5 bg-black text-white text-[11px] uppercase tracking-widest font-bold rounded-full hover:bg-gray-800 transition-all"
              >
                {user ? 'Panel de Control' : 'Consola'}
              </button>
            </nav>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-30 bg-[#f5f5f4] pt-24 px-6"
            >
              <nav className="flex flex-col gap-6 text-2xl font-bold tracking-tighter">
                <a href="#services" onClick={() => setIsMenuOpen(false)}>Soluciones</a>
                <a href="#methodology" onClick={() => setIsMenuOpen(false)}>Metodología</a>
                <a href="#initiatives" onClick={() => setIsMenuOpen(false)}>Iniciativas</a>
                <a href="#whyus" onClick={() => setIsMenuOpen(false)}>Por Qué DevTech</a>
                <button onClick={() => { setIsMenuOpen(false); handleLogin(); }} className="text-left text-indigo-600">
                  {user ? 'Panel de Control' : 'Consola'}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-24 pb-16 flex flex-col justify-center">
          
          {/* Hero Section */}
          <section className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 mb-8 py-10">
            <motion.div {...fadeIn} className="max-w-3xl lg:w-1/2 relative z-10 pt-10 lg:pt-0">
              <h1 className="text-[12vw] sm:text-[10vw] lg:text-[80px] xl:text-[90px] leading-[1] font-medium tracking-tight mb-8">
                Aceleración Digital
                <br />
                <span className="text-gray-400">&</span> Soluciones
                <br />
                Inteligentes.
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-gray-600 leading-relaxed font-light mb-12">
                DevTech es una consultora de desarrollo ágil y estrategia tecnológica especializada en optimizar el ciclo de vida del software mediante Vibe Coding y arquitecturas de Inteligencia Artificial.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <button 
                  onClick={handleLogin}
                  className="bg-black text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-800 transition-all cursor-pointer flex-shrink-0"
                >
                  {user ? 'Ir al Panel' : 'Iniciar Proyecto'}
                </button>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <div className="w-12 h-[1px] bg-black/20"></div>
                  Construyendo el futuro
                </div>
              </div>
            </motion.div>

            {/* Right Abstract Visual */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="hidden lg:flex w-1/2 justify-center lg:justify-end relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
                {/* Decorative Rings */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[10%] rounded-full border border-dashed border-black/10"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[25%] rounded-full border border-black/10 flex items-start justify-center"
                >
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full -mt-[5px] shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                </motion.div>

                {/* Core Sphere */}
                <div className="w-32 h-32 bg-black rounded-full shadow-2xl flex items-center justify-center relative z-20">
                  <BrainCircuit className="w-12 h-12 text-white rotate-90" />
                  <div className="absolute inset-0 rounded-full border border-white/20"></div>
                </div>

                {/* Floating Cards */}
                <motion.div 
                  animate={{ y: [-15, 5, -15] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[15%] left-0 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-black/5 flex items-center gap-4 z-30"
                >
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div className="pr-2">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Metodología</div>
                    <div className="text-sm font-bold text-black tracking-tight">Vibe Coding</div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [15, -5, 15] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-[20%] right-[-10%] bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-black/5 flex items-center gap-4 z-30"
                >
                  <div className="p-3 bg-[#0a0a0a] rounded-xl text-white">
                    <Database className="w-6 h-6" />
                  </div>
                  <div className="pr-2">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Arquitectura</div>
                    <div className="text-sm font-bold text-black tracking-tight">Cloud Native</div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-16 border-t border-black/10">
            <motion.h2 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-widest mb-12 text-gray-400"
            >
              Soluciones Estratégicas
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {[
                { title: "Software de Nueva Generación", description: "Implementamos metodologías que integran LLMs para el prototipado y despliegue rápido de aplicaciones personalizadas, minimizando la fricción técnica.", icon: <Code2 className="w-6 h-6" /> },
                { title: "Optimización de Procesos con IA", description: "Diseñamos e integramos soluciones de automatización (SaaS) que conectan operaciones actuales con herramientas de IA para elevar la productividad.", icon: <BrainCircuit className="w-6 h-6 rotate-90" /> },
                { title: "Arquitecturas Modernas & Cloud", description: "Consultoría en la migración y gestión de infraestructura en la nube, garantizando entornos seguros, robustos y preparados para crecer bajo demanda.", icon: <Database className="w-6 h-6" /> },
                { title: "Mentoría Ejecutiva en TI", description: "Capacitamos a cuadros directivos y técnicos en el uso estratégico de herramientas emergentes, asegurando resultados medibles de la inversión.", icon: <Globe className="w-6 h-6" /> }
              ].map((service, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  <div className="mb-6 text-black/50 group-hover:text-blue-600 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-light">{service.description}</p>
                  <div className="mt-6 w-8 h-[1px] bg-black/20 group-hover:w-16 group-hover:bg-blue-600 transition-all duration-300"></div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Methodology Section */}
          <section id="methodology" className="py-16 border-t border-black/10">
            <motion.h2 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-widest mb-12 text-gray-400"
            >
              Cómo Trabajamos
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Discovery & Estrategia", desc: "Analizamos tus procesos actuales y definimos los cuellos de botella donde la tecnología o la IA pueden generar el mayor ROI." },
                { step: "02", title: "Prototipado Rápido", desc: "Utilizamos herramientas avanzadas de AI-assisted coding para lanzar una versión funcional del producto en tiempo récord." },
                { step: "03", title: "Iteración Ágil", desc: "Probamos en entornos reales, recopilamos feedback de los usuarios y refinamos la solución mediante ciclos cortos y efectivos." },
                { step: "04", title: "Escalabilidad", desc: "Una vez validada la solución, robustecemos la arquitectura y migramos a infraestructura Cloud preparándola para un crecimiento sostenido." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-6 md:pl-0"
                >
                  <div className="hidden md:block absolute top-4 left-0 w-full h-[1px] bg-black/10"></div>
                  <div className="hidden md:block absolute top-3 left-0 w-2 h-2 rounded-full bg-black"></div>
                  
                  {/* Mobile timeline line */}
                  <div className="md:hidden absolute top-2 bottom-0 left-[3px] w-[1px] bg-black/10"></div>
                  <div className="md:hidden absolute top-2 left-0 w-2 h-2 rounded-full bg-black"></div>

                  <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 md:mt-8">{item.step}</div>
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Tech Stack Section */}
          <section id="techstack" className="py-16 border-t border-black/10 overflow-hidden">
            <motion.h2 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-widest mb-12 text-gray-400 text-center"
            >
              Stack Tecnológico Premium
            </motion.h2>

            <div className="flex flex-wrap justify-center gap-3 md:gap-6 max-w-4xl mx-auto">
              {['React & Next.js', 'Node.js & Python', 'TypeScript', 'OpenAI & Google AI', 'AWS & Vercel', 'PostgreSQL & Redis', 'Tailwind CSS', 'Docker'].map((tech, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-6 py-3 border border-black/10 rounded-full text-sm font-medium hover:border-blue-600 hover:text-blue-600 transition-colors cursor-default"
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Initiatives Section */}
          <section id="initiatives" className="py-16 border-t border-black/10">
            <motion.h2 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-widest mb-12 text-gray-400"
            >
              Nuestras Iniciativas
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
               className="bg-[#0a0a0a] text-[#f5f5f4] rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row gap-12 relative z-10">
                <div className="md:w-1/2 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full">HealthTech</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">MediFlex AI</h3>
                    <p className="text-gray-400 font-light leading-relaxed mb-8">
                        Una división desarrollada por DevTech dedicada exclusivamente a transformar el sector salud. Combinamos inteligencia artificial generativa y desarrollo ágil para optimizar la gestión hospitalaria, automatizar procesos médicos y mejorar la atención al paciente.
                    </p>
                    <ul className="space-y-4 mb-10">
                        {[
                            "Gestión Inteligente de Turnos y Agendas",
                            "Automatización de Tareas Administrativas",
                            "Análisis Predictivo de Datos y Triaje",
                            "Experiencia del Paciente Optimizada"
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-4 text-sm text-gray-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-auto">
                      <button onClick={handleLogin} className="inline-flex items-center gap-3 text-emerald-400 text-sm font-bold uppercase tracking-widest hover:text-emerald-300 transition-colors group">
                          Conocer más sobre MediFlex 
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                </div>
                <div className="md:w-1/2 flex items-center justify-center">
                   {/* Abstract representation of MediFlex AI */}
                   <div className="w-full aspect-square md:aspect-auto md:h-full min-h-[300px] bg-gradient-to-br from-emerald-900/40 to-black rounded-2xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center group">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                            >
                                <div className="relative">
                                  <HeartPulse className="w-12 h-12 text-emerald-400" />
                                  <Sparkles className="w-5 h-5 text-emerald-200 absolute -top-1 -right-2" />
                                </div>
                            </motion.div>
                            <div className="flex flex-col items-center gap-2">
                              <div className="px-4 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md font-mono text-emerald-400/70 text-xs">
                                AI-ASSISTED HEALTHCARE
                              </div>
                            </div>
                        </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Why DevTech Section */}
          <section id="whyus" className="py-16 border-t border-black/10">
            <div className="flex flex-col md:flex-row gap-12 md:gap-24">
              <motion.div 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="md:w-1/3"
              >
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-400">
                  Por qué DevTech
                </h2>
                <h3 className="text-4xl font-medium tracking-tight leading-tight">
                  La ventaja de construir el futuro hoy.
                </h3>
              </motion.div>
              
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  { title: "Velocidad", desc: "Reducción drástica de tiempos de desarrollo gracias a IA generativa." },
                  { title: "Escalabilidad", desc: "Soluciones pensadas para crecer fluidamente con su negocio." },
                  { title: "Simplicidad", desc: "Traducimos la complejidad en herramientas intuitivas y de alto impacto." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <h4 className="text-lg font-bold mb-3">{item.title}</h4>
                    <p className="text-gray-600 font-light leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Manifesto / CTA Section */}
          <section className="py-16 border-t border-black/10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-black text-white rounded-3xl p-10 md:p-20 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
              
              <p className="text-2xl md:text-4xl font-medium tracking-tight mb-12 relative z-10 leading-snug">
                "En DevTech, aceleramos la transformación digital mediante software asistido por IA. <span className="text-gray-400">No solo construimos herramientas; diseñamos la ventaja competitiva para liderar en un mercado que no se detiene.</span>"
              </p>
              
              <div className="relative z-10 self-start">
                <button 
                  onClick={handleLogin}
                  className="group flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Empezar Proyecto
                  <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </motion.div>
          </section>
        </main>

        <footer className="border-t border-black/10 mt-auto bg-[#f5f5f4] z-10 relative">
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold tracking-tighter">DevTech.</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex flex-wrap justify-center gap-4">
              <span>© {new Date().getFullYear()} DEVTECH</span>
              <span className="hidden md:inline">•</span>
              <a href="#" className="hover:text-black">LinkedIn</a>
              <span className="hidden md:inline">•</span>
              <a href="#" className="hover:text-black">Twitter</a>
            </div>
          </div>
        </footer>
      </div>

      <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
    </>
  );
}
