import React, { useState } from 'react';
import { Network, Users, Gift, Truck, Target, Wallet, DollarSign, Activity, FileText, X } from 'lucide-react';

interface BMCData {
  customerSegments?: string[];
  valuePropositions?: string[];
  channels?: string[];
  customerRelationships?: string[];
  revenueStreams?: string[];
  keyResources?: string[];
  keyActivities?: string[];
  keyPartnerships?: string[];
  costStructure?: string[];
}

export function BusinessModelCanvas({ data, isGenerating }: { data?: BMCData, isGenerating?: boolean }) {
  const [selectedItem, setSelectedItem] = useState<{ title: string; content: string; color: string } | null>(null);

  const colors = [
    'bg-amber-100 hover:bg-amber-200 border-amber-200 text-amber-900',
    'bg-blue-100 hover:bg-blue-200 border-blue-200 text-blue-900',
    'bg-emerald-100 hover:bg-emerald-200 border-emerald-200 text-emerald-900',
    'bg-rose-100 hover:bg-rose-200 border-rose-200 text-rose-900',
    'bg-violet-100 hover:bg-violet-200 border-violet-200 text-violet-900',
  ];

  const renderList = (items?: string[], sectionTitle?: string) => {
    if (!items || items.length === 0) return <p className="text-slate-400 text-xs italic">Aún sin definir</p>;
    return (
      <div className="flex flex-wrap gap-2">
         {items.map((item, i) => {
            const colorClass = colors[i % colors.length];
            // Remove hover states for the modal color
            const modalColorClass = colorClass.replace(/hover:bg-[^\s]+/g, '');
            return (
              <div 
                key={i} 
                title={item}
                onClick={() => setSelectedItem({ title: sectionTitle || '', content: item, color: modalColorClass })}
                className={`cursor-pointer border rounded-md shadow-sm w-10 h-10 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-md ${colorClass} relative overflow-hidden group`}
              >
                 <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-black/5 opacity-50 rounded-bl-sm"></div>
                 <FileText className="w-4 h-4 opacity-40 group-hover:opacity-70 transition-opacity" />
              </div>
            )
         })}
      </div>
    );
  };

  const Block = ({ title, icon: Icon, children, className = "" }: any) => (
    <div className={`bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col ${className}`}>
       <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
             <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
       </div>
       <div className="flex-1">
          {children}
       </div>
    </div>
  );

  return (
    <div className="relative w-full h-full overflow-y-auto p-6 bg-slate-50 custom-scrollbar">
       <div className={`max-w-6xl mx-auto space-y-4 ${isGenerating ? 'opacity-50 pointer-events-none transition-opacity' : ''}`}>
           {isGenerating && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                 <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="font-medium text-sm">El Asistente está actualizando el Canvas...</span>
                 </div>
              </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
               {/* Left Column */}
               <Block title="Socios Clave" icon={Network} className="md:col-span-1 h-full min-h-[200px]">
                  {renderList(data?.keyPartnerships, "Socios Clave")}
               </Block>

               {/* Center-Left Column */}
               <div className="md:col-span-1 flex flex-col gap-4">
                  <Block title="Actividades Clave" icon={Activity} className="flex-1 min-h-[150px]">
                     {renderList(data?.keyActivities, "Actividades Clave")}
                  </Block>
                  <Block title="Recursos Clave" icon={FileText} className="flex-1 min-h-[150px]">
                     {renderList(data?.keyResources, "Recursos Clave")}
                  </Block>
               </div>

               {/* Center Column */}
               <Block title="Propuestas de Valor" icon={Gift} className="md:col-span-1 h-full min-h-[200px] border-indigo-200 bg-indigo-50/30">
                  {renderList(data?.valuePropositions, "Propuestas de Valor")}
               </Block>

               {/* Center-Right Column */}
               <div className="md:col-span-1 flex flex-col gap-4">
                  <Block title="Relaciones Cliente" icon={Users} className="flex-1 min-h-[150px]">
                     {renderList(data?.customerRelationships, "Relaciones Cliente")}
                  </Block>
                  <Block title="Canales" icon={Truck} className="flex-1 min-h-[150px]">
                     {renderList(data?.channels, "Canales")}
                  </Block>
               </div>

               {/* Right Column */}
               <Block title="Segmentos Cliente" icon={Target} className="md:col-span-1 h-full min-h-[200px]">
                  {renderList(data?.customerSegments, "Segmentos Cliente")}
               </Block>
           </div>

           {/* Bottom Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Block title="Estructura de Costos" icon={Wallet} className="min-h-[150px]">
                  {renderList(data?.costStructure, "Estructura de Costos")}
               </Block>
               <Block title="Fuentes de Ingresos" icon={DollarSign} className="min-h-[150px]">
                  {renderList(data?.revenueStreams, "Fuentes de Ingresos")}
               </Block>
           </div>
       </div>

       {/* Modal for viewing Post-it content */}
       {selectedItem && (
         <div 
           className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" 
           onClick={() => setSelectedItem(null)}
         >
            <div 
              className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border animate-in zoom-in-95 duration-200 ${selectedItem.color}`} 
              onClick={(e) => e.stopPropagation()}
            >
               <div className="flex justify-between items-center mb-4 pb-3 border-b border-black/10">
                  <h3 className="font-bold opacity-80 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>
                    {selectedItem.title}
                  </h3>
                  <button onClick={() => setSelectedItem(null)} className="p-1.5 hover:bg-black/10 rounded-full transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               <div className="whitespace-pre-wrap text-base font-medium leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  {selectedItem.content}
               </div>
            </div>
         </div>
       )}
    </div>
  );
}
