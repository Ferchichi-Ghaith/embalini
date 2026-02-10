"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ProductCard from "@/components/elements/utils/productcard";

// Mock Data updated for 6 products
const products = [
  { id: "1", title: "Coffret Signature", price: "45.0 TND", image: "/images/p1.jpg", etat: "Premium", subtitle: "Archive_001" },
  { id: "2", title: "Étui Minimaliste", price: "29.0 TND", image: "/images/p2.png", etat: "Stock Limité", subtitle: "Archive_002" },
  { id: "3", title: "Enveloppe Kraft", price: "12.0 TND", image: "/images/p3.png", etat: "Eco-Conçu", subtitle: "Archive_003" },
  { id: "4", title: "Coffret Signature V2", price: "45.0 TND", image: "/images/p1.jpg", etat: "Premium", subtitle: "Archive_004" },
  { id: "5", title: "Étui Minimaliste V2", price: "29.0 TND", image: "/images/p2.png", etat: "Stock Limité", subtitle: "Archive_005" },
  { id: "6", title: "Enveloppe Kraft V2", price: "12.0 TND", image: "/images/p3.png", etat: "Eco-Conçu", subtitle: "Archive_006" },
];

const ShowcasePage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 2026 Interaction: Spring-based Parallax (adds physical weight to the scroll)
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const slowScroll = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), springConfig);
  const fastScroll = useSpring(useTransform(scrollYProgress, [0, 1], [0, -120]), springConfig);

  // User Context: Integrated your accountType field
  const accountType = "COMPANY"; 

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden selection:bg-[#A3E635]  selection:text-black ">
      
      {/* 1. KINETIC BACKGROUND TYPOGRAPHY (Brutalism Layer) */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.09]">
        <h2 className="text-[20vw] font-black italic uppercase tracking-tighter leading-none select-none">
          EMBALINI
        </h2>
      </div>

      <section className="relative z-10 pt-40 pb-40 px-6 md:px-12 max-w-[1600px] mx-auto">
        
        {/* 2. DYNAMIC HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 border-b border-white/10 pb-6">
          <div className="max-w-2xl space-y-8">
           
            <h1 className="text-5xl md:text-[8rem] font-black uppercase tracking-tighter italic leading-[0.75]">
              Notre Solutions <br /> <span className="text-[#A3E635]">d'Emballage.</span>
            </h1>
          </div>
          
          
        </div>

        {/* 3. STAGGERED 3-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
          {products.map((product, index) => {
     

            return (
              <motion.div
                key={product.id}
                // Apply different parallax velocities based on column
               
                className={`flex flex-col `}
              >
                <ProductCard 
                  {...product} 
               
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. DESIGNER FOOTER */}
      <footer className="relative z-10 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center px-12 gap-8 text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">
        <p>© 2026 — Global Packaging Standards</p>
        <div className="flex gap-8">
          <button className="hover:text-[#A3E635] transition-colors">Sustainability Index</button>
          <button className="hover:text-[#A3E635] transition-colors">Legal</button>
        </div>
      </footer>
    </main>
  );
};

export default ShowcasePage;