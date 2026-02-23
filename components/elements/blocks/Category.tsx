import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Leaf, Loader2 } from 'lucide-react';

// Définition du type pour la catégorie
interface Category {
  title: string;
  tag: string;
  img: string;
  size: 'lg' | 'md';
  etat: string;
}

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/v1/category/');
        const data = await response.json();
        
        const formattedData = data.map((cat: any, index: number): Category => {
          // Logique de rythme demandée : 
          // Index 0: LG, 1: MD, 2: LG, 3: MD, 4: MD, 5: LG
          const mod = index % 6;
          let currentSize: 'lg' | 'md' = 'md';
          
          if (mod === 0 || mod === 3 || mod === 4) {
            currentSize = 'lg';
          } else {
            currentSize = 'md';
          }

          return {
            title: cat.title,
            tag: cat.title,
            img: cat.image || cat.img,
            size: currentSize,
            etat: ["Premium", "Luxe", "Bio-Sourced", "Renforcé", "Satiné"][index % 5]
          };
        });

        setCategories(formattedData);
      } catch (error) {
        console.error("Erreur API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#94C973]" size={40} />
      </div>
    );
  }

  return (
    <section className="relative py-32 px-4 md:px-12 overflow-hidden border-t border-[#0D2C30]/5">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="relative z-10 max-w-[1500px] mx-auto">
        
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end mb-16">
          <div className="md:col-span-8">
            <div className="flex items-center gap-4 mb-6">
              <Leaf size={14} className="text-[#94C973]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#94C973]">Index des Gammes</span>
            </div>
            <h2 className="text-[#0D2C30] text-6xl md:text-8xl font-extralight tracking-tighter leading-[0.8] uppercase">
              Nos <span className="font-serif italic text-[#94C973] lowercase">solutions</span> <br /> 
              <span className="opacity-15">sur-mesure.</span>
            </h2>
          </div>
          
          <div className="md:col-span-4 flex flex-col md:items-end gap-6 pb-2">
            <p className="text-[#0D2C30] text-xs leading-relaxed md:text-right max-w-[260px]">
              Une ingénierie de précision au service de votre image de marque. Conçu pour durer, pensé pour protéger.
            </p>
          </div>
        </div>

        {/* Bento Grid Dynamique */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 auto-rows-[440px]">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className={`group relative overflow-hidden rounded-sm bg-[#0D2C30] transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] 
                ${cat.size === 'lg' ? 'md:col-span-7' : 'md:col-span-5'}`}
            >
              {/* Image Layer */}
              <img 
                src={cat.img} 
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D2C30] via-[#0D2C30]/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />

              {/* Card UI */}
              <div className="absolute inset-0 p-10 flex flex-col justify-between z-20">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 border border-white/20 rounded-full text-[10px] text-white uppercase tracking-widest backdrop-blur-md">
                    {cat.etat}
                  </span>
                </div>

                <div className="flex justify-between items-end">
                  <h4 className="text-white text-4xl md:text-5xl font-light tracking-tight uppercase leading-[0.85]">
                    {cat.title.split(' ')[0]} <br />
                    <span className="font-serif italic text-[#94C973] lowercase">
                      {cat.title.split(' ').slice(1).join(' ')}
                    </span>
                  </h4>
                  
                  <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-700 group-hover:bg-[#94C973] group-hover:border-[#94C973] group-hover:scale-110">
                    <ArrowUpRight size={24} strokeWidth={1} className="group-hover:rotate-45 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              <a href={`/products`} className="absolute inset-0 z-30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;