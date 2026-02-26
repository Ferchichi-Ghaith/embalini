import React from 'react';
import { 
  Leaf, Recycle, Droplets, TreeDeciduous, 
  PenTool, Box, ShieldCheck, ArrowRight, Quote 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

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

const SustainabilityFocus = () => {
  const points = [
    { text: "Réduction de la déforestation", icon: <TreeDeciduous className="w-5 h-5" /> },
    { text: "Moins d'énergie et d'eau consommées", icon: <Droplets className="w-5 h-5" /> },
    { text: "Diminution des déchets", icon: <Recycle className="w-5 h-5" /> },
    { text: "Image de marque écologique", icon: <Leaf className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: Green Embalini (The Why) */}
      <section className="relative overflow-hidden py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-600/10 hidden md:block" />
        
        <div className="max-w-7xl mx-auto">
          <header className="mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-[#004d4d] tracking-tight text-center md:text-left border-b border-slate-200 pb-6 uppercase">
              Pourquoi choisir un <span className="text-emerald-600">emballage eco-responsable</span> ?
            </h2>
          </header>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.01]">
                <img
                  src="/images/embaliniwhy.jpg" 
                  alt="Embalini Presentation"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-white/95 backdrop-blur px-4 py-2 rounded-lg text-sm font-bold tracking-[0.2em] text-slate-800 shadow-xl">
                    EMBALLINI
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                <p className="font-medium text-slate-900 border-l-4 border-emerald-500 pl-4">
                  La box en carton <span className="text-emerald-700 font-bold">Embalini</span> est une solution d'emballage écologique conçue à partir de papier recyclé et valorisé.
                </p>
                <p>
                  Solide, légère et 100% recyclable, elle répond aux besoins des entreprises et des producteurs à la recherche d'un emballage <span className="italic underline decoration-emerald-300 underline-offset-4">responsable et esthétique.</span>
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {points.map((point, index) => (
                  <Card 
                    key={index} 
                    className="group flex items-center gap-4 p-4 border-none shadow-sm bg-slate-50 hover:shadow-md hover:bg-emerald-50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                      {point.icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{point.text}</span>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Process Section (The How) */}
      <section className="relative py-32 px-6 bg-[#F9F9F7] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="container mx-auto max-w-[1400px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24 items-end">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, idx) => (
              <div 
                key={idx}
                className={`relative p-10 flex flex-col justify-between h-[420px] group overflow-hidden transition-colors duration-500
                  ${idx % 2 === 0 ? 'bg-[#0D2C30] text-white' : 'bg-white text-[#0D2C30] border border-[#0D2C30]/5'}
                  rounded-sm hover:z-10`}
              >
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

                <div className={`relative z-10 flex items-center justify-between mt-auto pt-6 border-t
                  ${idx % 2 === 0 ? 'border-white/20' : 'border-[#0D2C30]/20'}`}>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Standard Excellence</span>
                  <ArrowRight size={16} />
                </div>
                
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0
                  ${idx % 2 === 0 ? 'bg-[#143d42]' : 'bg-[#94C973]/5'}`} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: CSR Quote (The Vision) */}
      <section className="relative overflow-hidden bg-white py-24 px-6">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-4xl mx-auto relative">
          <div className="flex flex-col items-center text-center space-y-10">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-200/50">
              <Quote className="w-8 h-8 text-white fill-white" />
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.3] text-slate-800 tracking-tight">
              “Adoptez un <span className="text-emerald-600 font-semibold italic">packaging éco-responsable</span> et renforcez votre stratégie <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-bold">RSE</span> grâce à nos solutions d’emballage.”
            </h2>

            <div className="flex items-center gap-4 w-full max-w-xs">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-emerald-200" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-emerald-200" />
            </div>

            <div className="flex items-center gap-3 opacity-80 pt-8">
              <div className="text-center">
                <p className="text-2xl font-black text-[#004d4d] tracking-tighter flex items-center justify-center gap-1">
                  <Leaf className="w-6 h-6 text-emerald-500 fill-emerald-500" />
                  embalini
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Sustainable Packaging Range</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SustainabilityFocus;