"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Quote } from "lucide-react";

interface CTAProps {
  userAccountType?: "COMPANY" | "INDIVIDUAL";
}

const TESTIMONIALS = [
  {
    quote: "Qualité exceptionnelle pour nos sacs en carton. Répond parfaitement aux exigences du luxe.",
    name: "LINEN COLOR",
    role: "Partenaire Eco-Luxe"
  },
  {
    quote: "Une solution écologique personnalisée que je recommande sans hésiter.",
    name: "Faten Oueslati",
    role: "Digital Curator"
  },
  {
    quote: "L'initiative durable qu'il manquait au marché. Bravo pour la finition.",
    name: "Soulaïma Omrani",
    role: "CEO Afawih"
  }
];

export function CTA({ userAccountType = "INDIVIDUAL" }: CTAProps) {
  const isCompany = userAccountType === "COMPANY";

  const content = {
    title: isCompany ? "INGÉNIERIE" : "L'ART DE",
    highlight: isCompany ? "DU PACKAGING" : "L'EMBALLAGE",
    description: isCompany 
      ? "Optimisez votre chaîne logistique avec nos solutions biosourcées haute performance."
      : "Sublimez l'expérience déballage de vos clients avec nos matériaux d'exception.",
    cta: isCompany ? "Demander une étude B2B" : "Voir les collections"
  };

  return (
    <section className="relative py-32 px-6 bg-[#F9F9F7] overflow-hidden">
      {/* Texture Grain Subtile */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          
          {/* GAUCHE : CONTENU ÉDITORIAL */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-12"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-px bg-[#94C973]" />
                {/* Texte plus foncé pour la lisibilité */}
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0D2C30]/70">
                  Prêt pour expédition
                </span>
              </div>
              
              <h2 className="text-7xl md:text-9xl font-extralight leading-[0.85] tracking-tighter text-[#0D2C30] uppercase">
                {content.title} <br />
                <span className="font-serif italic text-[#94C973] lowercase text-7xl md:text-9xl">
                  {content.highlight}
                </span>
              </h2>
              
              {/* Description avec contraste renforcé (opacity 80 au lieu de 50) */}
              <p className="text-xl text-[#0D2C30]/80 max-w-md font-normal leading-relaxed">
                {content.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-8">
              <button className="group relative flex items-center gap-10 px-10 py-6 bg-[#0D2C30] text-white rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]">
                <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.2em]">{content.cta}</span>
                <ArrowRight className="w-5 h-5 text-[#94C973] group-hover:translate-x-2 transition-transform" />
              </button>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} className="fill-[#94C973] text-[#94C973]" />)}
                </div>
                <span className="text-[10px] font-bold text-[#0D2C30] uppercase tracking-widest opacity-60">
                  Satisfaction certifiée
                </span>
              </div>
            </div>
          </motion.div>

          {/* DROITE : TÉMOIGNAGES TEXTUELS (LISIBILITÉ MAXIMALE) */}
          <div className="lg:col-span-6 grid grid-cols-1 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group p-10 bg-white border border-[#0D2C30]/5 rounded-xl shadow-[0_4px_20px_rgba(13,44,48,0.02)] hover:shadow-[0_20px_40px_rgba(13,44,48,0.05)] transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-6">
                  <Quote className="text-[#94C973] opacity-40 group-hover:opacity-100 transition-opacity" size={24} />
                  <div className="h-px w-12 bg-[#0D2C30]/10 mt-3" />
                </div>

                <p className="text-xl text-[#0D2C30] font-medium leading-tight mb-8 tracking-tight italic">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-[#0D2C30]">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-[#94C973] font-bold uppercase tracking-tighter">
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Accents visuels Sage Green */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#94C973]/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}