"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Leaf, Recycle, Wind } from "lucide-react";

export function BrandPhilosophy() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Effet de parallaxe sur le texte en arrière-plan
  const xTransform = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section ref={containerRef} className="relative py-40 bg-[#F9F9F7] overflow-hidden">
      
      {/* Texte Géant en Parallaxe (Esthétique 2026) */}
      <motion.div 
        style={{ x: xTransform }}
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap pointer-events-none opacity-[0.02] select-none"
      >
        <span className="text-[30vw] font-black uppercase tracking-tighter text-[#0D2C30]">
          Eco-Conception Durable
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Colonne de Gauche : La Vision */}
          <div className="lg:col-span-7 space-y-12">
            <div className="flex items-center gap-4">
               <div className="w-12 h-px bg-[#94C973]" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#94C973]">Notre Engagement</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-extralight text-[#0D2C30] leading-[1.1] tracking-tighter uppercase">
              Réduire l'empreinte, <br />
              <span className="font-serif italic text-[#94C973] lowercase">sans compromis</span> <br />
              sur l'élégance.
            </h2>

            <p className="text-xl md:text-2xl text-[#0D2C30]/70 font-light leading-relaxed max-w-2xl">
              Chez <span className="text-[#0D2C30] font-bold">Embalini</span>, nous croyons que le luxe de demain réside dans la préservation. Chaque sac, chaque boîte est une promesse tenue envers la nature tunisienne.
            </p>
          </div>

          {/* Colonne de Droite : Les Piliers (Cartes flottantes) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:mt-24">
            {[
              { 
                title: "Zéro Plastique", 
                desc: "100% de nos solutions sont recyclables ou compostables.",
                icon: <Recycle size={18} />
              },
              { 
                title: "Énergie Propre", 
                desc: "Optimisation de nos cycles de production pour limiter le CO2.",
                icon: <Wind size={18} />
              },
              { 
                title: "Sourcing Local", 
                desc: "Priorité aux matières premières transformées en Tunisie.",
                icon: <Leaf size={18} />
              }
            ].map((pillar, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                className="p-8 bg-white border border-[#0D2C30]/5 rounded-2xl shadow-xl shadow-[#0D2C30]/5 flex gap-6 items-start group hover:border-[#94C973]/30 transition-all"
              >
                <div className="p-3 rounded-xl bg-[#94C973]/10 text-[#94C973] group-hover:bg-[#94C973] group-hover:text-white transition-all">
                  {pillar.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-[#0D2C30]">{pillar.title}</h4>
                  <p className="text-sm text-[#0D2C30]/60 font-light leading-snug">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Badge de certification flottant */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-20 hidden xl:flex w-32 h-32 border border-[#94C973]/20 rounded-full items-center justify-center"
      >
        <span className="text-[8px] font-bold text-[#94C973] uppercase tracking-widest text-center px-4">
          Produit avec ❤️ en Tunisie
        </span>
      </motion.div>
    </section>
  );
}