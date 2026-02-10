"use client";

import React from 'react';
import { motion } from "framer-motion";
import { ArrowUpRight, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full rounded-t-[3.5rem] bg-black py-20 text-white overflow-hidden">
      {/* Texture de grain subtile pour la cohérence avec le Hero */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Titre Massive avec Animation de Révélation */}
        <div className="overflow-hidden border-b border-white/10 pb-10">
          <motion.h2 
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[16vw] font-[1000] leading-none tracking-tighter text-[#A3E635] italic uppercase"
          >
            Embalini<span className="text-white">.</span>
          </motion.h2>
        </div>

        {/* Grille de contenu principale */}
        <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Section Services - Basée sur vos segments API */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A3E635]">Solutions</h4>
            <ul className="space-y-3 text-lg font-medium text-white/60">
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group">
                Logistique Pro (COMPANY) <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group">
                Éditions Limitées <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group">
                État Premium Certifié <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </li>
            </ul>
          </div>

          {/* Section Contact & Social */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A3E635]">Connect</h4>
            <div className="flex gap-6 text-white/60">
              <Linkedin className="hover:text-[#A3E635] cursor-pointer transition-colors" size={20} />
              <Instagram className="hover:text-[#A3E635] cursor-pointer transition-colors" size={20} />
              <Twitter className="hover:text-[#A3E635] cursor-pointer transition-colors" size={20} />
            </div>
            <p className="text-lg font-medium text-white/60">hello@embalini.com</p>
          </div>

          {/* Section Location */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A3E635]">Studio</h4>
            <p className="text-lg font-medium text-white/60 leading-relaxed">
              75001 Paris, France<br/>
              Logistique Globale
            </p>
          </div>

          {/* CTA & Newsletter */}
          <div className="flex flex-col justify-between gap-8">
            <div className="space-y-4">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A3E635]">Newsletter</h4>
               <div className="relative group">
                 <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="w-full bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-[#A3E635] transition-colors text-sm"
                 />
                 <ArrowUpRight className="absolute right-0 top-2 text-white/20 group-hover:text-[#A3E635] transition-colors" size={18} />
               </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-full bg-[#A3E635] py-5 text-[11px] font-black uppercase tracking-widest text-black hover:bg-white transition-all shadow-xl"
            >
              Démarrer un Projet
            </motion.button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          <p>© {currentYear} Embalini. Tous droits réservés.</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Mentions Légales</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors italic">Built for 2026 Experience</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;