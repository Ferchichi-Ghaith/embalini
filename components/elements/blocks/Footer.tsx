"use client";

import React from 'react';
import { motion } from "framer-motion";
import { ArrowUpRight, Phone, Mail, MapPin, Facebook, Globe, MessageSquare, ExternalLink } from "lucide-react";

interface FooterProps {
  userAccountType?: "COMPANY" | "INDIVIDUAL";
}

const Footer = ({ userAccountType = "INDIVIDUAL" }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  // Animations simplifiées et typées
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  } as const;

  return (
    <footer className="relative w-full rounded-t-[3rem] md:rounded-t-[5rem] bg-[#050505] pt-20 pb-10 text-white overflow-hidden">
      {/* Background Decor - Effet de lueur subtile sous le bouton */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#A3E635]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Top Header - Slogan ou État */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <span className="text-[#A3E635] text-xs font-black uppercase tracking-[0.4em]">Prêt pour l'expédition ?</span>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Emballons vos idées.</h3>
          </motion.div>
          
          <div className="hidden md:block">
             <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <span className="flex h-2 w-2 rounded-full bg-[#A3E635] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Disponible en Tunisie</span>
             </div>
          </div>
        </div>

        {/* Titre Massif Responsive */}
        <div className="overflow-hidden border-y border-white/5 py-8 mb-16">
          <motion.h2 
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[16vw] font-[1000] leading-[0.8] tracking-tighter text-[#A3E635] italic uppercase select-none opacity-90"
          >
            Embalini<span className="text-white">.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Section 1: Contact avec Micro-interactions */}
          <motion.div {...fadeInUp} viewport={{ once: true }} className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Contact Rapide</h4>
            <div className="space-y-4">
              <a href="tel:+21698154061" className="group block">
                <p className="text-xs text-white/30 mb-1 group-hover:text-[#A3E635] transition-colors">Téléphone</p>
                <p className="text-xl font-bold group-hover:translate-x-2 transition-transform duration-300 tracking-tight">+216 98 154 061</p>
              </a>
              <a href="mailto:embalinii@gmail.com" className="group block">
                <p className="text-xs text-white/30 mb-1 group-hover:text-[#A3E635] transition-colors">Email</p>
                <p className="text-xl font-bold group-hover:translate-x-2 transition-transform duration-300 tracking-tight italic">embalinii@gmail.com</p>
              </a>
            </div>
          </motion.div>

          {/* Section 2: Localisation Stylisée */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} viewport={{ once: true }} className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Localisation</h4>
            <a 
              href="https://maps.google.com/?q=Medjez+el+Bab" 
              target="_blank" 
              className="group flex items-start gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#A3E635]/30 transition-all"
            >
              <div className="p-3 rounded-2xl bg-[#A3E635] text-black group-hover:rotate-12 transition-transform">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">Medjez el Bab</p>
                <p className="text-sm text-white/40 font-medium">Béja, Tunisie</p>
              </div>
            </a>
          </motion.div>

          {/* Section 3: Navigation / Écosystème */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} viewport={{ once: true }} className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Écosystème</h4>
            <div className="grid grid-cols-2 gap-3">
              <a href="https://embalini.tn" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-bold text-xs uppercase tracking-tighter border border-white/5">
                <Globe size={14}/> Site Web
              </a>
              <a href="https://www.facebook.com/profile.php?id=61551044658027" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-[#1877F2] transition-colors font-bold text-xs uppercase tracking-tighter border border-white/5">
                <Facebook size={14}/> Facebook
              </a>
              <a href="https://wa.me/21698154061" className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-[#25D366] transition-colors font-bold text-xs uppercase tracking-tighter border border-white/5">
                <MessageSquare size={14}/> Support WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Section 4: CTA Premium */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }} viewport={{ once: true }} className="flex flex-col justify-end">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group overflow-hidden w-full rounded-3xl bg-[#A3E635] py-8 text-black text-center"
            >
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Prêt à commencer ?</span>
                <span className="text-lg font-[1000] uppercase tracking-tight flex items-center gap-2">
                   {userAccountType === "COMPANY" ? "Demander un Devis" : "Nouveau Projet"}
                   <ArrowUpRight size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </div>
              {/* Animation de brillance au survol */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </motion.a>
          </motion.div>
        </div>

        {/* Footer Bottom Section */}
        <div className="pt-10 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
            <p>© {currentYear} Embalini. Tous droits réservés.</p>
           
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 italic">Crafted by</span>
            <a 
              href="https://wa.me/21621104800" 
              target="_blank" 
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-[#A3E635] hover:text-black transition-all duration-500 shadow-2xl"
            >
              Ghaith Ferchiochi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;