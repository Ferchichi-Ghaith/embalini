"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ChevronRight, Sparkles, Package } from "lucide-react";
import ProductCard from "@/components/elements/utils/productcard";
import { cn } from "@/lib/utils";

// Types updated with your API fields
interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  etat?: string; // From your saved API data
  category?: {
    title: string;
  };
}

interface Category {
  id: string;
  title: string;
}

const ShowcasePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/v1/produit/"),
        fetch("/api/v1/category/")
      ]);
      
      if (!prodRes.ok || !catRes.ok) throw new Error("Fetch failed");

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (err) {
      console.error("Erreur Embalini:", err);
      setError(true);
    } finally {
      // Small buffer for animation orchestrator
      setTimeout(() => setIsLoading(false), 800);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    const list = activeCategory === "all" 
      ? products 
      : products.filter((p) => p.category?.title === activeCategory);
    return list;
  }, [activeCategory, products]);

  return (
    <main className="relative min-h-screen bg-white selection:bg-[#94C973] selection:text-white overflow-x-hidden">
      
      {/* LOADER OVERLAY */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0D2C30] text-white"
          >
             <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 flex flex-col items-center"
            >
              <h2 className="text-5xl font-black tracking-tighter uppercase mb-2">Embalini</h2>
              <div className="h-[1px] w-12 bg-[#94C973] animate-pulse" />
            </motion.div>
            <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
               <span className="text-[30vw] font-black">2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND WATERMARK */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.02] select-none">
        <h2 className="text-[20vw] font-black uppercase">Embalini</h2>
      </div>

      <section className="relative z-10 pt-24 md:pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        
        <header className="mb-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#94C973]">Premium Packaging</span>
          </motion.div>
          <h1 className="text-[#0D2C30] text-5xl md:text-7xl font-light tracking-tight leading-none uppercase">
            Solutions <span className="font-serif italic text-[#94C973]">durables</span>
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-32 h-fit">
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-6 px-2">Catégories</p>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar snap-x">
              <CategoryButton 
                label="Tous les produits" 
                active={activeCategory === "all"} 
                onClick={() => setActiveCategory("all")} 
              />
              {categories.map((cat) => (
                <CategoryButton 
                  key={cat.id}
                  label={cat.title}
                  active={activeCategory === cat.title}
                  onClick={() => setActiveCategory(cat.title)}
                />
              ))}
            </nav>
          </aside>

          {/* PRODUCT GRID */}
          <div className="flex-grow">
            <LayoutGroup>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <ProductCard 
                        {...product} 
                        category={product.category?.title}
                        // Passing 'etat' to your component for badges like "New" or "Recycled"
                       
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>

            {/* EMPTY STATE */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 border border-dashed rounded-3xl border-zinc-200">
                <Package className="text-zinc-200 mb-4" size={48} />
                <p className="text-zinc-400 font-medium">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

// Extracted Sub-component for cleaner code
const CategoryButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex justify-between items-center group",
      active ? "bg-[#0D2C30] text-white" : "bg-transparent text-zinc-500 hover:bg-zinc-50"
    )}
  >
    {label}
    <ChevronRight size={14} className={cn("transition-transform", active ? "translate-x-0" : "-translate-x-2 opacity-0")} />
  </button>
);

export default ShowcasePage;