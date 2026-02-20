"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, LayoutGrid, ChevronRight, Loader2, Sparkles } from "lucide-react";
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
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrage optimisé
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category?.title === activeCategory);
  }, [activeCategory, products]);

  return (
    <main className="relative min-h-screen bg-white selection:bg-[#94C973] selection:text-white">
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
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8 bg-[#94C973]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#94C973]">Collection 2026</span>
          </motion.div>
          
          <h1 className="text-[#0D2C30] text-4xl md:text-[5rem] font-light tracking-tighter leading-[0.85] uppercase">
         
            <span className="font-serif italic text-[#94C973] lowercase">conditionnement</span> <br /> 
            <span className="opacity-50">durables.</span>
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* NAVIGATION LATÉRALE */}
          <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-40 h-fit z-30">
            <div className="flex items-center gap-3 mb-8 hidden lg:flex">
              <div className="p-2 bg-[#0D2C30] rounded-lg">
                <LayoutGrid size={14} className="text-white" />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0D2C30]">Catalogues</h3>
            </div>
            
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
                  <ChevronRight 
                    size={14} 
                    className={cn(
                      "hidden lg:block transition-transform duration-500", 
                      activeCategory === cat.title ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                    )} 
                  />
                </button>
              ))}
            </nav>
          </aside>

          {/* GRILLE DE PRODUITS */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-zinc-50 animate-pulse rounded-[2.5rem]" />
                ))}
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.05,
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                    >
                      <ProductCard 
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        image={product.image}
                        badge={product.etat} 
                        category={product.category?.title}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
            
            {/* ÉTAT VIDE */}
            {!isLoading && filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-40 text-center border-2 border-dashed border-zinc-100 rounded-[3rem] flex flex-col items-center gap-4"
              >
                <Sparkles size={24} className="text-[#94C973]/40" />
                <p className="text-[#0D2C30]/30 font-serif italic text-xl tracking-tight">
                  Aucun produit dans cette catégorie pour le moment.
                </p>
                <button 
                  onClick={() => setActiveCategory("all")}
                  className="text-[10px] font-black uppercase tracking-widest text-[#94C973] hover:opacity-60 transition-opacity"
                >
                  Revenir au catalogue complet
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