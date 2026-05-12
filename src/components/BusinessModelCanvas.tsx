import React from 'react';
import { Network, Users, Gift, Truck, Target, Wallet, DollarSign, Activity, FileText } from 'lucide-react';

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
  const renderList = (items?: string[]) => {
    if (!items || items.length === 0) return <p className="text-slate-400 text-xs italic">Aún sin definir</p>;
    return (
      <ul className="list-disc pl-4 space-y-1">
         {items.map((item, i) => (
            <li key={i} className="text-sm text-slate-700">{item}</li>
         ))}
      </ul>
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
       {/* 
         Standard BMC Grid 
         Top row: 5 columns
         Bottom row: 2 columns
       */}
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
                  {renderList(data?.keyPartnerships)}
               </Block>

               {/* Center-Left Column */}
               <div className="md:col-span-1 flex flex-col gap-4">
                  <Block title="Actividades Clave" icon={Activity} className="flex-1 min-h-[150px]">
                     {renderList(data?.keyActivities)}
                  </Block>
                  <Block title="Recursos Clave" icon={FileText} className="flex-1 min-h-[150px]">
                     {renderList(data?.keyResources)}
                  </Block>
               </div>

               {/* Center Column */}
               <Block title="Propuestas de Valor" icon={Gift} className="md:col-span-1 h-full min-h-[200px] border-indigo-200 bg-indigo-50/30">
                  {renderList(data?.valuePropositions)}
               </Block>

               {/* Center-Right Column */}
               <div className="md:col-span-1 flex flex-col gap-4">
                  <Block title="Relaciones Cliente" icon={Users} className="flex-1 min-h-[150px]">
                     {renderList(data?.customerRelationships)}
                  </Block>
                  <Block title="Canales" icon={Truck} className="flex-1 min-h-[150px]">
                     {renderList(data?.channels)}
                  </Block>
               </div>

               {/* Right Column */}
               <Block title="Segmentos Cliente" icon={Target} className="md:col-span-1 h-full min-h-[200px]">
                  {renderList(data?.customerSegments)}
               </Block>
           </div>

           {/* Bottom Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Block title="Estructura de Costos" icon={Wallet} className="min-h-[150px]">
                  {renderList(data?.costStructure)}
               </Block>
               <Block title="Fuentes de Ingresos" icon={DollarSign} className="min-h-[150px]">
                  {renderList(data?.revenueStreams)}
               </Block>
           </div>
       </div>
    </div>
  );
}
