import React from 'react';
import { Leaf, Recycle, Droplets, TreeDeciduous } from 'lucide-react';
import { Card } from '@/components/ui/card';

const GreenEmbaliniSection = () => {
  const points = [
    { text: "Réduction de la déforestation", icon: <TreeDeciduous className="w-5 h-5" /> },
    { text: "Moins d'énergie et d'eau consommées", icon: <Droplets className="w-5 h-5" /> },
    { text: "Diminution des déchets", icon: <Recycle className="w-5 h-5" /> },
    { text: "Image de marque écologique", icon: <Leaf className="w-5 h-5" /> },
  ];

  return (
    <section className="relative overflow-hidden  py-16 px-6 md:px-12 lg:px-24">
      {/* Decorative side accent */}
      <div className="absolute top-0 right-0 w-1.5 h-full bg-violet-600/20 hidden md:block" />

      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-[#004d4d] tracking-tight text-center md:text-left border-b border-slate-200 pb-6">
            POURQUOI CHOISIR UN <span className="text-emerald-600">EMBALLAGE ECO-RESPONSABLE</span> ?
          </h2>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visuals */}
          <div className="lg:col-span-5 space-y-6">
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

          {/* Right Column: Content */}
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
                  className="group flex items-center gap-4 p-4 border-none shadow-sm bg-white hover:shadow-md hover:bg-emerald-50 transition-all duration-300"
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

        {/* Footer Brand */}
        <footer className="mt-20 flex justify-center md:justify-end items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          <div className="text-right">
            <p className="text-2xl font-black text-[#004d4d] tracking-tighter flex items-center justify-end gap-1">
              <Leaf className="w-6 h-6 text-emerald-500 fill-emerald-500" />
              embalini
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Sustainable Packaging Range</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default GreenEmbaliniSection;