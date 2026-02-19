"use client";

import { PenTool, Box, Leaf, ShieldCheck, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Conception",
    desc: "Étude de vos besoins et design structurel de l'emballage.",
    icon: <PenTool size={20} />,
  },
  {
    number: "02",
    title: "Matériaux",
    desc: "Sélection de papiers et cartons biosourcés haute densité.",
    icon: <Leaf size={20} />,
  },
  {
    number: "03",
    title: "Manufacture",
    desc: "Production de précision avec finitions artisanales.",
    icon: <Box size={20} />,
  },
  {
    number: "04",
    title: "Protection",
    desc: "Contrôle qualité rigoureux pour une sécurité totale.",
    icon: <ShieldCheck size={20} />,
  },
];

export function ProcessSection() {
  return (
    <section className="relative py-40 px-6 bg-[#F9F9F7] overflow-hidden">
      {/* Grain texture subtile */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container mx-auto max-w-[1400px] relative z-10">
        
        {/* Header Style Editorial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-32 items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#94C973]">Le Savoir-Faire</span>
              <div className="h-px w-12 bg-[#94C973]" />
            </div>
            <h2 className="text-5xl md:text-7xl font-extralight tracking-[-0.05em] text-[#0D2C30] uppercase leading-[0.8]">
              L'ingénierie <br />
              <span className="font-serif italic text-[#94C973] lowercase text-6xl md:text-[10rem]">du détail.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 pb-4">
            <p className="text-sm text-[#0D2C30]/60 uppercase font-bold tracking-widest leading-relaxed border-l border-[#94C973] pl-6">
              Une méthodologie rigoureuse pour des solutions de packaging qui transcendent l'ordinaire.
            </p>
          </div>
        </div>

        {/* Layout de Processus Alterné (Sans animations de mouvement) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step, idx) => (
            <div 
              key={idx}
              className={`relative p-10 flex flex-col justify-between h-[450px] group overflow-hidden transition-colors duration-500
                ${idx % 2 === 0 ? 'bg-[#0D2C30] text-white' : 'bg-white text-[#0D2C30] border border-[#0D2C30]/5'}
                rounded-sm hover:z-10`}
            >
              {/* Contenu de la Carte */}
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-12">
                  <span className={`text-5xl font-mono font-extralight opacity-20 ${idx % 2 === 0 ? 'text-[#94C973]' : 'text-[#0D2C30]'}`}>
                    {step.number}
                  </span>
                  <div className={`p-4 rounded-full border transition-transform duration-700 group-hover:rotate-12
                    ${idx % 2 === 0 ? 'border-white/10 text-[#94C973]' : 'border-[#0D2C30]/10 text-[#94C973]'}`}>
                    {step.icon}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-3xl font-light uppercase tracking-tighter leading-none">
                    {step.title}
                  </h4>
                  <p className={`text-sm leading-relaxed font-light
                    ${idx % 2 === 0 ? 'text-white/60' : 'text-[#0D2C30]/60'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Footer de la Carte */}
              <div className={`relative z-10 flex items-center justify-between mt-auto pt-6 border-t opacity-100 transition-opacity duration-500
                ${idx % 2 === 0 ? 'border-white/20' : 'border-[#0D2C30]/20'}`}>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Standard Excellence</span>
                <ArrowRight size={16} />
              </div>

              {/* Effet de Hover Statique (Background change) */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0
                ${idx % 2 === 0 ? 'bg-[#143d42]' : 'bg-[#94C973]/5'}`} 
              />
            </div>
          ))}
        </div>

       
      </div>
    </section>
  );
}