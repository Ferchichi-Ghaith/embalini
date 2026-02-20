"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, LayoutGrid, ChevronRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/elements/utils/productcard";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  title: string;
}

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  etat?: string;
  category?: {
    title: string;
  };
}

const ShowcasePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/v1/produit/"),
          fetch("/api/v1/category/")
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        setProducts(Array.isArray(prodData) ? prodData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        // On laisse un petit délai pour que l'animation de sortie soit fluide
        setTimeout(() => setIsLoading(false), 1200);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category?.title === activeCategory);
  }, [activeCategory, products]);

  return (
    <main className="relative min-h-screen bg-white selection:bg-[#94C973] selection:text-white">
      
      {/* --- COOL LOADING OVERLAY --- */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              y: "-100%",
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0D2C30] text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <motion.h2 
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl md:text-6xl font-black tracking-tighter uppercase"
                >
                  Embalini
                </motion.h2>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute -bottom-2 left-0 h-[2px] bg-[#94C973]"
                />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#94C973] mt-2">
                Initialisation du catalogue...
              </span>
            </motion.div>

            {/* Décoration subtile en arrière-plan du loader */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden flex items-center justify-center">
               <h2 className="text-[40vw] font-black leading-none uppercase">2026</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DECOR ARRIÈRE-PLAN */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.03] overflow-hidden select-none">
        <h2 className="text-[25vw] font-black uppercase tracking-[-0.05em] text-[#0D2C30] leading-none">
          EMBALINI
        </h2>
      </div>

      <section className="relative z-10 pt-24 md:pt-40 pb-20 px-4 md:px-12 max-w-[1800px] mx-auto">
        
        {/* EN-TÊTE PRINCIPAL */}
        <header className="mb-16 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-[#94C973]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#94C973]">Collection 2026</span>
          </motion.div>
          
          <motion.h1 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6, duration: 0.8 }}
             className="text-[#0D2C30] text-4xl md:text-[5rem] font-light tracking-tighter leading-[0.85] uppercase"
          >
            <span className="font-serif italic text-[#94C973] lowercase">conditionnement</span> <br /> 
            <span className="opacity-50">durables.</span>
          </motion.h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* NAVIGATION LATÉRALE */}
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-40 h-fit z-30">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-4 lg:pb-0 snap-x">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "snap-start shrink-0 px-8 py-4 lg:px-6 lg:py-5 rounded-2xl transition-all duration-500 text-[10px] font-black uppercase tracking-widest border border-transparent",
                  activeCategory === "all" 
                    ? "bg-[#0D2C30] text-white shadow-2xl shadow-[#0D2C30]/20 scale-105 z-10" 
                    : "bg-zinc-50 text-[#0D2C30]/40 hover:bg-zinc-100"
                )}
              >
                Tout l'inventaire
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.title)}
                  className={cn(
                    "snap-start shrink-0 flex items-center justify-between px-8 py-4 lg:px-6 lg:py-5 rounded-2xl transition-all duration-500 border border-transparent group",
                    activeCategory === cat.title 
                      ? "bg-[#0D2C30] text-white shadow-2xl shadow-[#0D2C30]/20 scale-105 z-10" 
                      : "bg-zinc-50 text-[#0D2C30]/40 hover:bg-zinc-100"
                  )}
                >
                  <span className="text-[11px] font-black uppercase tracking-tight whitespace-nowrap">
                    {cat.title}
                  </span>
                  <ChevronRight size={14} className={cn("hidden lg:block transition-transform duration-500", activeCategory === cat.title ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0")} />
                </button>
              ))}
            </nav>
          </aside>

          {/* GRILLE DE PRODUITS */}
          <div className="flex-grow">
            <motion.div 
              layout
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-10"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.03, // Effet cascade ultra rapide
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                  >
                    <ProductCard 
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      image={product.image}
                      category={product.category?.title}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {!isLoading && filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-40 text-center border-2 border-dashed border-zinc-100 rounded-[3rem] flex flex-col items-center gap-4"
              >
                <Sparkles size={24} className="text-[#94C973]/40" />
                <p className="text-[#0D2C30]/30 font-serif italic text-xl tracking-tight">
                  Aucun produit dans cette catégorie pour le moment.
                </p>
                <button 
                  onClick={() => setActiveCategory("all")}
                  className="text-[10px] font-black uppercase tracking-widest text-[#94C973]"
                >
                  Catalogue complet
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
};

export default ShowcasePage;