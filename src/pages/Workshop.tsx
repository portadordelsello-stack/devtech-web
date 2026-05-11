import React, { useState } from 'react';
import { Bot, Sparkles, Globe2, ShoppingBag, LayoutDashboard, MessageSquareMore, CheckCircle2, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

export default function Workshop({ user }: { user: any }) {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormSubmitted(true);
  };

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
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900 flex flex-col relative overflow-x-hidden pt-20">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#f5f5f4]/90 backdrop-blur-md border-b border-black/5 text-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-tighter hover:opacity-80">DevTech.</Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <a href="/#services" className="hover:text-gray-500 transition-colors uppercase text-[11px] tracking-widest text-[#0a0a0a]">Soluciones</a>
            <a href="/#methodology" className="hover:text-gray-500 transition-colors uppercase text-[11px] tracking-widest text-[#0a0a0a]">Metodología</a>
            <a href="/#initiatives" className="hover:text-gray-500 transition-colors uppercase text-[11px] tracking-widest text-[#0a0a0a]">Iniciativas</a>
            <a href="/#capacitaciones" className="hover:text-gray-500 transition-colors uppercase text-[11px] tracking-widest text-[#0a0a0a]">Academia</a>
            <a href="/#whyus" className="hover:text-gray-500 transition-colors uppercase text-[11px] tracking-widest text-[#0a0a0a]">Por Qué DevTech</a>
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
            className="fixed inset-0 z-30 bg-[#f5f5f4] pt-24 px-6 text-[#0a0a0a]"
          >
            <nav className="flex flex-col gap-6 text-2xl font-bold tracking-tighter">
              <a href="/#services" onClick={() => setIsMenuOpen(false)}>Soluciones</a>
              <a href="/#methodology" onClick={() => setIsMenuOpen(false)}>Metodología</a>
              <a href="/#initiatives" onClick={() => setIsMenuOpen(false)}>Iniciativas</a>
              <a href="/#capacitaciones" onClick={() => setIsMenuOpen(false)}>Academia</a>
              <a href="/#whyus" onClick={() => setIsMenuOpen(false)}>Por Qué DevTech</a>
              <button onClick={() => { setIsMenuOpen(false); handleLogin(); }} className="text-left text-indigo-600">
                {user ? 'Panel de Control' : 'Consola'}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative pt-12 md:pt-24 pb-20 md:pb-32 px-6 md:px-12 border-b border-slate-200 bg-[#F8F9FA] overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 relative">
            <div className="opacity-0 animate-fade-in-up inline-flex items-center gap-2 mb-6 md:mb-8 px-4 py-2 rounded-full border border-slate-200 bg-white text-black font-bold text-xs shadow-sm" style={{ animationDelay: '0.1s' }}>
              <Sparkles className="w-4 h-4" />
              <span>Workshop Sin Costo • Cupos Limitados • 2 Encuentros</span>
            </div>

            <h1 className="opacity-0 animate-fade-in-up text-5xl sm:text-6xl md:text-[5rem] font-extrabold text-black leading-[0.95] tracking-tight mb-8" style={{ animationDelay: '0.2s' }}>
              Creá soluciones<br />
              reales con<br />
              <span className="text-slate-400 font-semibold">Inteligencia</span><br />
              Artificial.
            </h1>

            <p className="opacity-0 animate-fade-in-up text-xl md:text-2xl text-slate-800 font-medium max-w-xl leading-relaxed mb-4" style={{ animationDelay: '0.3s' }}>
              Traé una idea o un problema de tu negocio. Salí con una solución funcionando.
            </p>

            <p className="opacity-0 animate-fade-in-up text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed mb-10" style={{ animationDelay: '0.4s' }}>
              Descubrí cómo personas sin experiencia técnica están creando páginas web, automatizaciones y herramientas digitales usando lenguaje natural e Inteligencia Artificial.
            </p>

            <div className="opacity-0 animate-fade-in-up flex flex-col sm:flex-row gap-4" style={{ animationDelay: '0.5s' }}>
              <a href="#registro" className="bg-black text-white px-8 py-5 rounded-full font-bold uppercase tracking-widest text-[12px] text-center hover:bg-slate-800 transition-all">
                Reservá tu lugar
              </a>

              <a href="#ejemplos" className="border border-slate-300 bg-white px-8 py-5 rounded-full font-bold uppercase tracking-widest text-[12px] text-center hover:border-black transition-all">
                Ver ejemplos
              </a>
            </div>

            <div className="opacity-0 animate-fade-in-up mt-10 flex flex-wrap gap-4 text-sm text-slate-500 font-medium" style={{ animationDelay: '0.6s' }}>
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-full">Sin conocimientos previos</div>
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-full">Resultados en vivo</div>
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-full">Herramientas reales</div>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center items-center h-full min-h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[400px] h-[400px] rounded-full border border-slate-200 absolute"></div>
              <div className="w-[600px] h-[600px] rounded-full border border-slate-200 absolute opacity-50"></div>
              <div className="w-[800px] h-[800px] rounded-full border border-slate-200 absolute opacity-20"></div>

              <div className="w-48 h-48 rounded-full bg-black shadow-[0_0_80px_rgba(0,0,0,0.15)] flex items-center justify-center relative z-10 translate-x-12 translate-y-24">
                <Globe2 className="w-16 h-16 text-white opacity-80" strokeWidth={1.5} />
              </div>
            </div>

            <div className="opacity-0 animate-scale-in bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center gap-5 relative z-20 -translate-x-20 -translate-y-16" style={{ animationDelay: '0.8s' }}>
              <div className="w-14 h-14 rounded-2xl bg-[#F8F9FA] flex flex-col justify-center items-center text-slate-800 border border-slate-200">
                <Bot className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div>
                <span className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Vibe Coding</span>
                <span className="block text-lg font-bold text-black leading-none">Creá hablando con IA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-bold text-black leading-relaxed tracking-tight">
            No se trata de magia ni de reemplazar personas.
          </p>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed mt-4 max-w-3xl mx-auto">
            Se trata de usar herramientas modernas para resolver problemas reales más rápido, reducir tareas repetitivas y potenciar lo que ya hacés.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-12 bg-white" id="ejemplos">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-6">
            Ejemplos reales
          </h2>

          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-black max-w-3xl leading-[1.1] mb-12">
            Lo que hoy podés crear con IA usando lenguaje natural.
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#F8F9FA] border border-slate-200 rounded-3xl p-8">
              <div className="aspect-video rounded-2xl bg-white border border-slate-200 mb-6 flex items-center justify-center text-slate-400 text-sm font-semibold">
                Landing Page
              </div>
              <p className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-3">Idea → Resultado</p>
              <h4 className="text-2xl font-bold text-black mb-4">Página para un emprendimiento</h4>
              <p className="text-slate-500 leading-relaxed">
                Una persona describe su negocio en lenguaje natural y obtiene una web moderna lista para mostrar servicios o vender productos.
              </p>
            </div>

            <div className="bg-[#F8F9FA] border border-slate-200 rounded-3xl p-8">
              <div className="aspect-video rounded-2xl bg-white border border-slate-200 mb-6 flex items-center justify-center text-slate-400 text-sm font-semibold">
                Sistema de Turnos
              </div>
              <p className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-3">Problema → Solución</p>
              <h4 className="text-2xl font-bold text-black mb-4">Organización automatizada</h4>
              <p className="text-slate-500 leading-relaxed">
                Dejar atrás cuadernos, mensajes desordenados y tareas repetitivas creando herramientas simples adaptadas al negocio.
              </p>
            </div>

            <div className="bg-[#F8F9FA] border border-slate-200 rounded-3xl p-8">
              <div className="aspect-video rounded-2xl bg-white border border-slate-200 mb-6 flex items-center justify-center text-slate-400 text-sm font-semibold">
                Catálogo QR
              </div>
              <p className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-3">Prompt → App</p>
              <h4 className="text-2xl font-bold text-black mb-4">Herramientas listas en minutos</h4>
              <p className="text-slate-500 leading-relaxed">
                Verás cómo asistentes de IA generan estructuras funcionales en tiempo real mientras interactuás con ellos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-12 bg-[#F8F9FA]" id="como-funciona">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-12 md:mb-16">
            ¿Qué podés crear para tu negocio?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            <div className="group cursor-default">
              <ShoppingBag className="w-8 h-8 text-black mb-8 opacity-70" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">Catálogos y Tiendas Online</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Creá menús QR, tiendas web y catálogos digitales para mostrar productos y captar clientes.
              </p>
              <div className="w-12 h-[1px] bg-slate-300 group-hover:w-full transition-all duration-500"></div>
            </div>

            <div className="group cursor-default">
              <LayoutDashboard className="w-8 h-8 text-black mb-8 opacity-70" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">Sistemas para tu Negocio</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Organizá ventas, clientes, turnos e inventario sin depender de herramientas complejas.
              </p>
              <div className="w-12 h-[1px] bg-slate-300 group-hover:w-full transition-all duration-500"></div>
            </div>

            <div className="group cursor-default">
              <MessageSquareMore className="w-8 h-8 text-black mb-8 opacity-70" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">Automatización de Tareas</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Ahorrá tiempo automatizando respuestas frecuentes, formularios y procesos repetitivos.
              </p>
              <div className="w-12 h-[1px] bg-slate-300 group-hover:w-full transition-all duration-500"></div>
            </div>

            <div className="group cursor-default">
              <Globe2 className="w-8 h-8 text-black mb-8 opacity-70" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">Páginas Web Profesionales</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Lanzá páginas modernas para mostrar qué hacés, generar confianza y aumentar presencia online.
              </p>
              <div className="w-12 h-[1px] bg-slate-300 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-12 bg-white" id="para-quien">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-6">
              ¿Para quién es?
            </h2>

            <h3 className="text-4xl md:text-5xl font-bold text-black leading-[1.1] tracking-tight mb-8 max-w-2xl">
              Tecnología accesible para personas reales.
            </h3>

            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              Este workshop fue pensado para personas curiosas que quieren aprovechar la IA sin necesidad de convertirse en programadores.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#F8F9FA] border border-slate-200 rounded-2xl p-6">
              <h4 className="font-bold text-black mb-3">Emprendedores</h4>
              <p className="text-slate-500">Personas que quieren crecer digitalmente sin grandes costos iniciales.</p>
            </div>

            <div className="bg-[#F8F9FA] border border-slate-200 rounded-2xl p-6">
              <h4 className="font-bold text-black mb-3">Comercios</h4>
              <p className="text-slate-500">Negocios que buscan organizar procesos y mejorar atención al cliente.</p>
            </div>

            <div className="bg-[#F8F9FA] border border-slate-200 rounded-2xl p-6">
              <h4 className="font-bold text-black mb-3">Profesionales Independientes</h4>
              <p className="text-slate-500">Turnos, formularios, automatización y presencia online simplificada.</p>
            </div>

            <div className="bg-[#F8F9FA] border border-slate-200 rounded-2xl p-6">
              <h4 className="font-bold text-black mb-3">Personas Sin Experiencia Técnica</h4>
              <p className="text-slate-500">Ideal si sentís que la tecnología parece complicada o lejana.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-12 bg-[#F8F9FA] relative" id="metodologia">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-12 md:mb-16">
            Estructura del Workshop
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-black leading-[1.1] tracking-tight mb-6">
                Vibe Coding explicado simple.
              </h3>

              <p className="text-xl text-slate-800 font-medium leading-relaxed mb-4">
                Crear herramientas digitales usando lenguaje natural e Inteligencia Artificial.
              </p>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-8">
                En lugar de escribir código complejo desde cero, aprendés a comunicar ideas y objetivos a asistentes de IA para acelerar la creación de soluciones reales.
              </p>

              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] max-w-sm">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-black" />
                </div>
                <p className="font-medium text-slate-700 text-sm mt-1">100% pensado para personas sin conocimientos técnicos previos.</p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center">
                  <span className="w-[1px] h-full bg-slate-300 absolute top-8 bottom-[-24px] left-1/2 -translate-x-1/2"></span>
                  <span className="w-2 h-2 rounded-full bg-black relative z-10"></span>
                </div>
                <h4 className="text-xl font-bold text-black mb-2 -mt-1">1. Diagnóstico y Posibilidades</h4>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Encuentro 1 (1:30 hs): descubrimos herramientas accesibles, analizamos tareas repetitivas y aprendemos a escribir instrucciones efectivas para IA.
                </p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center">
                  <span className="w-[1px] h-full bg-slate-300 absolute top-8 bottom-[-24px] left-1/2 -translate-x-1/2"></span>
                  <span className="w-2 h-2 rounded-full bg-black relative z-10"></span>
                </div>
                <h4 className="text-xl font-bold text-black mb-2 -mt-1">2. Diseño de la Solución</h4>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Definimos juntos qué necesita cada persona: una web, un sistema de turnos, automatizaciones o herramientas internas.
                </p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-black relative z-10"></span>
                </div>
                <h4 className="text-xl font-bold text-black mb-2 -mt-1">3. Creación en Vivo</h4>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Encuentro 2 (1:30 hs): interactuamos con agentes de IA y vemos soluciones funcionales aparecer en tiempo real.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-12 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-6">
            Resultado esperado
          </p>

          <h2 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-8">
            Que descubras que sí podés crear.
          </h2>

          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-12">
            La meta no es que memorices teoría. La meta es que experimentes cómo una idea puede transformarse en una herramienta útil para tu vida o negocio.
          </p>

          <a href="#registro" className="inline-flex bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[12px] hover:bg-slate-200 transition-all">
            Quiero participar
          </a>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-12 bg-white" id="registro">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="sticky top-32">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-6">
              Inscripción
            </h2>

            <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black leading-[1.05] tracking-tight mb-8">
              Tu idea, funcionando.
            </h3>

            <p className="text-xl text-slate-600 leading-relaxed mb-10">
              Workshop inicial totalmente <span className="font-bold text-black">sin costo</span> y con grupos reducidos para acompañamiento personalizado.
            </p>

            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8">
              <div className="bg-[#F8F9FA] border border-slate-200 p-6 rounded-2xl shadow-sm text-center flex flex-col justify-center">
                <span className="block text-4xl font-bold text-black mb-2">0%</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Código previo</span>
              </div>

              <div className="bg-[#F8F9FA] border border-slate-200 p-6 rounded-2xl shadow-sm text-center flex flex-col justify-center">
                <span className="block text-4xl font-bold text-black mb-2">100%</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Práctico</span>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-[#F8F9FA] border border-slate-200 rounded-[2rem] p-8 md:p-12">
              <div className="mb-10">
                <h4 className="text-2xl font-bold text-black tracking-tight">Reservá tu lugar</h4>
                <p className="text-slate-500 mt-2 text-lg">Completá el formulario y contanos qué desafío querés resolver.</p>
              </div>

              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-black tracking-tight">¡Solicitud enviada!</h3>
                  <p className="text-slate-600 text-lg">
                    Pronto nos pondremos en contacto con más información del workshop.
                  </p>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-black mb-3">Nombre completo</label>
                      <input type="text" id="name" required className="w-full bg-white border border-slate-200 text-black px-5 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-slate-400" placeholder="Tu nombre" />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-black mb-3">Correo electrónico</label>
                      <input type="email" id="email" required className="w-full bg-white border border-slate-200 text-black px-5 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-slate-400" placeholder="hola@ejemplo.com" />
                    </div>

                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-bold text-black mb-3">WhatsApp</label>
                      <input type="tel" id="whatsapp" required className="w-full bg-white border border-slate-200 text-black px-5 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-slate-400" placeholder="Tu número de contacto" />
                    </div>

                    <div>
                      <label htmlFor="problem" className="block text-base font-bold text-black mb-3">
                        ¿Qué tarea o problema te gustaría resolver con IA?
                      </label>

                      <textarea id="problem" required rows={4} className="w-full bg-white border border-slate-200 text-black px-5 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all resize-none placeholder:text-slate-400" placeholder='Ej: “Pierdo tiempo respondiendo mensajes”, “No tengo página web”, “Quiero organizar turnos o pedidos”'></textarea>
                    </div>

                    <button type="submit" className="w-full bg-black text-white font-bold text-[13px] tracking-widest uppercase py-5 rounded-full hover:bg-slate-800 transition-all mt-8 flex justify-center items-center gap-3">
                      Quiero participar
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 md:px-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <Bot className="w-4 h-4 text-slate-400" />
            </div>

            <span className="text-xl font-bold tracking-tight text-black">CCA VibeCoding.</span>
          </div>

          <div className="text-[11px] uppercase tracking-widest font-semibold text-slate-400 text-center flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span>Alfabetización tecnológica aplicada.</span>
            <span className="hidden md:inline">•</span>
            <span>Workshop 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
