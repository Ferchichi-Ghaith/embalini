"use client";

import React, { useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plus, Minus, ArrowRight,  Zap,  } from "lucide-react";
import { useParams } from "next/navigation";

// --- Types & Mock Data (Enhanced for 2026) ---
const productsData = [
  {
    id: "1",
    title: "Coffret Signature",
    subtitle: "Series_01",
    price: 45.00,
    image: "/images/p1.jpg", 
    etat: "Premium",
    description: "Architectural structure meets sensory luxury. Engineered for brands that treat unboxing as a ceremony.",
    specs: [
      { label: "Material", value: "1200g Eco-Fiber" },
      { label: "Finish", value: "Soft-Touch Matte" },
      { label: "Origin", value: "France" }
    ]
  },
  {
    id: "2",
    title: "Étui Minimaliste",
    subtitle: "Series_02",
    price: 29.00,
    image: "/images/p2.png",
    etat: "Stock Limité",
    description: "Sleek, protective, and effortlessly elegant for high-end retail presentations.",
    specs: [
      { label: "Material", value: "Recycled Polymer" },
      { label: "Finish", value: "Satin" }
    ]
  },
  {
    id: "3",
    title: "Enveloppe Kraft Luxe",
    subtitle: "Series_03",
    price: 12.00,
    image: "/images/p3.png",
    etat: "Eco-Conçu",
    description: "Sustainable sophistication. The premium choice for eco-conscious document or accessory shipping.",
    specs: [
      { label: "Material", value: "Organic Kraft" },
      { label: "Origin", value: "France" }
    ]
  },
  // IDs 4, 5, and 6 follow the same structure as above
  {
    id: "4",
    title: "Coffret Signature",
    subtitle: "Series_01",
    price: 45.00,
    image: "/images/p1.jpg",
    etat: "Premium",
    description: "Architectural structure meets sensory luxury.",
    specs: [{ label: "Material", value: "1200g Eco-Fiber" }]
  },
  {
    id: "5",
    title: "Étui Minimaliste",
    subtitle: "Series_02",
    price: 29.00,
    image: "/images/p2.png",
    etat: "Stock Limité",
    description: "Sleek and protective retail presentation.",
    specs: [{ label: "Material", value: "Recycled Polymer" }]
  },
  {
    id: "6",
    title: "Enveloppe Kraft Luxe",
    subtitle: "Series_03",
    price: 12.00,
    image: "/images/p3.png",
    etat: "Eco-Conçu",
    description: "Sustainable sophistication for eco-conscious shipping.",
    specs: [{ label: "Material", value: "Organic Kraft" }]
  }
];

const ProductPage = () => {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const { scrollY } = useScroll();
  
  // Custom Instruction Data
  const accountType = "COMPANY"; // Options: "COMPANY" | "INDIVIDUAL"
  
  const product = useMemo(() => {
    return productsData.find((p) => p.id === params.id) || productsData[0];
  }, [params.id]);

  // Parallax & Reveal Effects
  const yImage = useTransform(scrollY, [0, 500], [0, -50]);
  const opacityNav = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1A1A1A] selection:bg-[#A3E635]">
      


      <main className="pt-32 pb-20 px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* 2. VISUAL STAGE */}
          <section className="relative lg:sticky lg:top-32">
            <motion.div 
              style={{ y: yImage }}
              className="relative aspect-square bg-[#A3E635] rounded-[40px] overflow-hidden flex items-center justify-center group"
            >
              <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                src={product.image} 
                className="w-3/4 h-3/4 object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] scale-110 rounded-2xl"
              />
              
           
            </motion.div>
          </section>

          {/* 3. INFORMATION ARCHITECTURE */}
          <section className="space-y-16">
            
            {/* Title Block */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-12 bg-black/20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40">{product.subtitle}</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] italic">
                {product.title}<span className="text-[#A3E635]">.</span>
              </h1>
            </div>

            {/* Pricing Card */}
            <div className="p-8 rounded-[32px] bg-white border border-black/5 shadow-2xl shadow-black/[0.02] flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">
                    {accountType === "COMPANY" ? "B2B Exclusive Rate" : "Retail Price"}
                  </p>
                  <h2 className="text-5xl font-light">
                    {(product.price * quantity).toFixed(2)}<span className="text-xl ml-1">TND</span>
                  </h2>
               </div>
               <div className="flex items-center bg-[#F4F4F4] rounded-2xl p-2 border border-black/5">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="p-4 hover:bg-white rounded-xl transition-all"><Minus size={16}/></button>
                  <span className="w-12 text-center font-black text-xl">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="p-4 hover:bg-white rounded-xl transition-all"><Plus size={16}/></button>
               </div>
            </div>

            {/* Description & Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="fill-[#A3E635] text-[#A3E635]"/> Overview
                  </h3>
                  <p className="text-xl text-black/60 font-medium leading-relaxed">
                    {product.description}
                  </p>
               </div>
               <div className="space-y-4">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-black/5">
                      <span className="text-[10px] font-bold uppercase text-black/40">{spec.label}</span>
                      <span className="text-xs font-black uppercase">{spec.value}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* CTA SECTION */}
            <div className="space-y-6">
              <motion.button 
                whileHover={{ scale: 1.01, backgroundColor: "#000", color: "#A3E635" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-8 bg-[#A3E635] text-black rounded-[24px] font-black uppercase tracking-[0.1em] text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#A3E635]/20 transition-all duration-500"
              >
                Start Request <ArrowRight size={18} />
              </motion.button>
            
            </div>

          </section>
        </div>
      </main>

  
    </div>
  );
};

export default ProductPage;