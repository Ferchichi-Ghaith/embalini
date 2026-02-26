"use client";

import React from 'react';
import { motion } from "framer-motion";
import { ArrowUpRight, Phone, Mail, MapPin, Facebook, Globe, MessageSquare, Star } from "lucide-react";

interface FooterProps {
  userAccountType?: "COMPANY" | "INDIVIDUAL";
}

const Footer = ({ userAccountType = "INDIVIDUAL" }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const isCompany = userAccountType === "COMPANY";

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  } as const;

  return (
    <footer className="relative w-full rounded-t-[2rem] md:rounded-t-[4rem] bg-[#0D2C30] pt-24 pb-12 text-white overflow-hidden">
      {/* Texture de grain & Lueur organique */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[#94C973]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Top Branding Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
          <motion.div {...fadeInUp} className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-[#94C973] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#94C973]">
                Manufacture de Prestige • Tunisie
              </span>
            </div>
            <h3 className="text-4xl md:text-6xl font-extralight tracking-tighter leading-tight uppercase">
              L'excellence du <br />
              <span className="font-serif italic text-[#94C973] lowercase">packaging durable.</span>
            </h3>
          </motion.div>
          
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="flex flex-col items-start md:items-end gap-4">
             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Aujourd'hui</p>
                <p className="text-sm font-light text-white/80">Atelier ouvert — Prêt pour de nouveaux projets.</p>
             </div>
          </motion.div>
        </div>

        {/* LOGO MONUMENTAL 2026 */}
        <div className="overflow-hidden border-y border-white/10 py-10 mb-20">
          <motion.h2 
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18vw] font-extralight leading-[0.7] tracking-tighter text-[#94C973] uppercase select-none flex justify-between items-baseline"
          >
            Emba<span className="font-serif italic lowercase ">l</span>ini
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Contact : Lisibilité Maximale */}
          <motion.div {...fadeInUp} className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Ligne Directe</h4>
            <div className="space-y-6">
              <a href="tel:+21698154061" className="group block">
                <p className="text-2xl font-light group-hover:text-[#94C973] transition-colors tracking-tighter">+216 98 154 061</p>
                <div className="h-px w-0 group-hover:w-full bg-[#94C973]/50 transition-all duration-500 mt-2" />
              </a>
              <a href="mailto:embalinii@gmail.com" className="group block">
                <p className="text-2xl font-light group-hover:text-[#94C973] transition-colors tracking-tighter italic">embalinii@gmail.com</p>
              </a>
            </div>
          </motion.div>

          {/* Localisation */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Atelier Principal</h4>
            <div className="space-y-2">
              <p className="text-xl font-light">Medjez el Bab</p>
              <p className="text-sm text-white/40 uppercase tracking-widest">Béja, Tunisie</p>
              <a href="#" className="flex items-center gap-2 text-[10px] font-bold text-[#94C973] uppercase tracking-widest mt-4 hover:gap-4 transition-all">
                Voir sur la carte <ArrowUpRight size={14}/>
              </a>
            </div>
          </motion.div>

          {/* Écosystème */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Digital</h4>
            <div className="flex flex-col gap-4">
              {[
                { name: "Facebook", icon: <Facebook size={14}/>, url: "https://www.facebook.com/share/1BGtBcPevK/" },
                { name: "WhatsApp", icon: <MessageSquare size={14}/>, url: "https://wa.me/21698154061" },
                { name: "Instagram", icon: <Globe size={14}/>, url: "https://www.instagram.com/embalini.tn?igsh=MWM2aWx3cHYwNnl1MQ==" }
              ].map((link) => (
                <a key={link.name} href={link.url} target="_blank" className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors group">
                  <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#94C973] group-hover:text-[#94C973] transition-all">
                    {link.icon}
                  </span>
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="flex flex-col justify-end">
            <a href="/products" className="group relative p-10 rounded-3xl bg-[#94C973] text-[#0D2C30] overflow-hidden transition-transform active:scale-95">
              <div className="relative z-10 flex flex-col gap-4">
                <Star size={24} className="fill-[#0D2C30]" />
                <span className="text-xl font-black uppercase tracking-tighter leading-none">
                  Lancer votre <br /> {isCompany ? "Projet B2B" : "Expérience"}
                </span>
                <ArrowUpRight size={32} strokeWidth={1} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-45 transition-transform duration-700">
                <Globe size={120} />
              </div>
            </a>
          </motion.div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
            © {currentYear} Embalini • L'art du sur-mesure tunisien.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 italic">Direction Artistique par</span>
            <a 
            target='_blank'
              href="https://www.zoz.tn" 
              className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#0D2C30] transition-all duration-700 shadow-2xl"
            >
             ZOZ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;