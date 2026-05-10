import { motion } from 'motion/react';
import {
  Code2,
  BrainCircuit,
  Cloud,
  Users,
  Zap,
  Layers,
  Lightbulb,
  ArrowRight,
  TerminalSquare
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function App() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F0F0F0] font-sans selection:bg-indigo-500/30 flex flex-col pt-6 pb-6 px-4 md:px-8">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col flex-grow relative z-10">
        {/* Navigation Bar */}
        <header className="flex justify-between items-center mb-6 h-12 shrink-0">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-lg leading-none">D</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white mb-0.5">DevTech</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-widest text-gray-500">
            <a href="#soluciones" className="hover:text-indigo-400 transition-colors">Soluciones</a>
            <a href="#filosofia" className="hover:text-indigo-400 transition-colors">Filosofía</a>
          </nav>
          <button 
            onClick={scrollToContact}
            className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-full hover:bg-indigo-500 hover:text-white transition-all hover:scale-105"
          >
            HABLEMOS
          </button>
        </header>

        {/* Bento Grid Main Content */}
        {/* It auto-adjusts rows based on content on mobile, and uses defined grid on desktop */}
        <main className="grid grid-cols-1 md:grid-cols-12 auto-rows-auto md:auto-rows-[minmax(140px,auto)] gap-4 flex-grow">
          {/* Main Hero Card */}
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="md:col-span-7 md:row-span-2 lg:row-span-3 bg-gradient-to-br from-indigo-900/40 to-black border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col justify-end relative overflow-hidden group"
          >
            <div className="absolute top-8 left-8 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] rounded-full border border-indigo-500/30 uppercase font-bold tracking-tighter italic">Vibe Coding</span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full border border-emerald-500/30 uppercase font-bold tracking-tighter">AI Optimized</span>
            </div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1] mt-24 mb-6">
              Aceleramos tu <br/>
              <span className="font-black text-indigo-500 italic">Ventaja Competitiva</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-gray-400 max-w-lg text-sm md:text-base leading-relaxed mb-4">
              Consultora de desarrollo ágil y estrategia tecnológica especializada en optimizar el ciclo de vida del software mediante arquitecturas de Inteligencia Artificial. Transformamos procesos manuales en flujos de trabajo automatizados.
            </motion.p>
          </motion.div>

          {/* Next Gen Software Card */}
          <motion.div variants={fadeIn} className="md:col-span-5 md:row-span-2 bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all rounded-full"></div>
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Solución 01</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Software de Nueva Generación</h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                Implementamos metodologías que integran LLMs para el prototipado rápido, minimizando fricción y maximizando funcionalidad.
              </p>
            </div>
          </motion.div>

          {/* AI Optimization Card */}
          <motion.div variants={fadeIn} id="soluciones" className="md:col-span-5 md:row-span-2 bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
            <div className="absolute -left-4 -top-4 w-32 h-32 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all rounded-full"></div>
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Solución 02</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Optimización de Procesos IA</h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                Diseñamos e integramos soluciones automatizadas que conectan sus operaciones con herramientas de IA para elevar la productividad.
              </p>
            </div>
          </motion.div>

          {/* Cloud Card */}
          <motion.div variants={fadeIn} className="md:col-span-4 md:row-span-2 bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:bg-white/[0.05] transition-colors flex flex-col justify-between">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all rounded-full"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                  Modern Cloud
                </h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-6">Migración y gestión en entornos seguros, robustos y escalables bajo demanda.</p>
              </div>
              <div className="flex items-baseline space-x-1.5 align-bottom mt-auto">
                <span className="text-4xl lg:text-5xl font-mono text-indigo-400 font-bold tracking-tighter">99.9%</span>
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Uptime<br/>Target</span>
              </div>
            </div>
          </motion.div>

          {/* Mentorship Card */}
          <motion.div variants={fadeIn} className="md:col-span-3 md:row-span-2 bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:bg-white/[0.05] transition-colors group">
            <div>
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Mentoría Ejecutiva
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-tight mb-8">Capacitación estratégica para directivos sobre el uso de herramientas tecnológicas emergentes.</p>
            </div>
            <div className="mt-auto flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#121214] flex items-center justify-center relative z-20 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e2e8f0" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-[#121214] flex items-center justify-center relative z-10 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=c7d2fe" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-[#121214] flex items-center justify-center text-xs font-bold shadow-[0_0_15px_rgba(79,70,229,0.5)] relative z-30">
                +15
              </div>
            </div>
          </motion.div>

          {/* Bottom Philosophy Card */}
          <motion.div variants={fadeIn} id="filosofia" className="md:col-span-12 md:row-span-1 bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-shadow">
            <div className="flex items-center space-x-6 md:space-x-8">
              <div className="hidden md:flex p-4 bg-indigo-50 rounded-2xl">
                <TerminalSquare className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
                  Nuestra Meta
                </span>
                <span className="text-black font-serif italic text-xl md:text-2xl leading-tight max-w-sm">
                  "No solo construimos herramientas; <span className="font-extrabold not-italic text-indigo-600">diseñamos la ventaja competitiva</span>."
                </span>
              </div>
            </div>
            
            <div id="contact" className="flex items-center gap-6 self-start md:self-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 w-full md:w-auto">
              <div className="flex space-x-6 pr-6 border-r border-gray-100">
                <div className="text-right">
                  <div className="text-black font-black text-2xl md:text-3xl leading-none">3X</div>
                  <div className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Velocidad</div>
                </div>
                <div className="text-right">
                  <div className="text-black font-black text-2xl md:text-3xl leading-none">Inf.</div>
                  <div className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Escala</div>
                </div>
              </div>
              <a href="mailto:contacto@devtech.com" className="group flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-black text-white rounded-full hover:bg-indigo-600 transition-all hover:-rotate-12 cursor-pointer shadow-lg mx-auto md:mx-0 shrink-0">
                <ArrowRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </motion.div>
        </main>

        {/* Simple Footer Line */}
        <footer className="mt-8 flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] text-gray-600 font-mono tracking-widest uppercase gap-3 shrink-0 pb-4">
          <span>© {new Date().getFullYear()} DEVTECH STRATEGY GROUP</span>
          <span className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
            SISTEMAS OPERATIVOS
          </span>
          <span>BUENOS AIRES • MADRID • REMOTE</span>
        </footer>
      </div>
    </div>
  );
}
