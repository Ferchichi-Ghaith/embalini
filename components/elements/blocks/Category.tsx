import React from 'react';
import { ArrowUpRight, Plus, Leaf } from 'lucide-react';

const categories = [
  { title: "Pochette en papier", tag: "Alimentaire", img: "/images/p1.jpg", size: "md", etat: "Premium" },
  { title: "Boite gateaux", tag: "Pâtisserie", img: "https://artpackaging.net/wp-content/uploads/2021/10/Boite-Gateau-personnalisee.jpg", size: "lg", etat: "Luxe" },
  { title: "Pochette zip", tag: "Hermétique", img: "/images/c6.jpg", size: "lg", etat: "Bio-Sourced" },
  { title: "Box en carton", tag: "E-commerce", img: "/images/c2.jpg", size: "md", etat: "Renforcé" },
  { title: "Papier plat", tag: "Habillage", img: "/images/c4.jpg", size: "lg", etat: "Satiné" },
  { title: "Sac kraft", tag: "Boutique", img: "/images/c1.jpg", size: "md", etat: "Premium" },
];

const CategorySection = () => {
  return (
    <section className="relative py-32 px-4 md:px-12 overflow-hidden border-t border-[#0D2C30]/5">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="relative z-10 max-w-[1500px] mx-auto">
        
        {/* Compact Award Header */}
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
            <p className="text-[#0D2C30] text-xs  leading-relaxed md:text-right max-w-[260px]">
              Une ingénierie de précision au service de votre image de marque. Conçu pour durer, pensé pour protéger.
            </p>
            
          </div>
        </div>

        {/* 2026 Compact Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 auto-rows-[440px]">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className={`group relative overflow-hidden rounded-sm bg-white transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] 
                ${cat.size === 'lg' ? 'md:col-span-7' : 'md:col-span-5'}`}
            >
              {/* Image Layer */}
              <img 
                src={cat.img} 
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-all"
              />
              
              {/* Gradient matching your Hero depth */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0D2C30]/90 via-[#0D2C30]/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700" />

              {/* Card UI */}
              <div className="absolute inset-0 p-10 flex flex-col justify-between z-20">
                <div className="flex justify-between items-start translate-y-[-10px] ">
                 
                  
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

              {/* Link */}
              <a href={`/shop/${cat.title.replace(/\s+/g, '-').toLowerCase()}`} className="absolute inset-0 z-30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;