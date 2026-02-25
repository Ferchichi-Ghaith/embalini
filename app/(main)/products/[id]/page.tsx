"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plus, Minus, ArrowRight, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface ProductSpec {
  label: string;
  value: string;
}

interface Product {
  id: string;
  title: string;
  nom?: string;
  subtitle: string;
  price: number;
  image: string;
  description: string;
  specs: ProductSpec[];
  etat?: string; // Integrated from your API data
}

interface CartItem {
  id: string;
  titre: string;
  quantite: number;
  prix_unitaire: number;
  prix_total: string;
  productimage: string;
}

const ProductPage = () => {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 1. Allow quantity to be number OR empty string for better UX while typing
  const [quantity, setQuantity] = useState<number | "">(1);
  const [isAdded, setIsAdded] = useState(false);

  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, -80]);

  // Mocking the accountType based on your instructions
  const accountType = "COMPANY"; 

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/produit/${params.id}`);
      if (!response.ok) throw new Error("Produit introuvable");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) fetchProduct();
  }, [fetchProduct]);

  // --- Input Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Allow empty string so user can backspace and type "22" without leading "1"
    if (rawValue === "") {
      setQuantity("");
      return;
    }

    const numValue = parseInt(rawValue, 10);
    if (!isNaN(numValue)) {
      setQuantity(numValue);
    }
  };

  const handleBlur = () => {
    // Safety check: if user leaves it empty or 0, reset to 1
    if (quantity === "" || quantity < 1) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (!product || quantity === "") return;

    const currentCart: CartItem[] = JSON.parse(localStorage.getItem("productpanierlist") || "[]");
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    
    const qtyToAdd = Number(quantity);

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantite += qtyToAdd;
      currentCart[existingItemIndex].prix_total = 
        (currentCart[existingItemIndex].quantite * product.price).toFixed(2);
    } else {
      currentCart.push({
        id: product.id,
        titre: product.title || product.nom || "Produit",
        quantite: qtyToAdd,
        prix_unitaire: product.price,
        prix_total: (product.price * qtyToAdd).toFixed(2),
        productimage: product.image,
      });
    }

    localStorage.setItem("productpanierlist", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdate"));
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBFBFB] gap-4">
        <Loader2 className="animate-spin text-[#94C973]" size={40} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Chargement Embalini...</p>
      </div>
    );
  }

  if (!product) return <div className="text-center pt-40 font-serif italic text-2xl">Produit non trouvé.</div>;

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#0D2C30] selection:bg-[#94C973] selection:text-white">
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-32 items-start">
          
          {/* LEFT: VISUALS */}
          <section className="relative lg:sticky lg:top-32">
            <motion.div 
              style={{ y: yImage }}
              className="relative aspect-square bg-zinc-100 rounded-[48px] overflow-hidden flex items-center justify-center border border-black/5"
            >
              {product.etat && (
                <div className="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 shadow-sm">
                  <span className="text-[9px] font-black uppercase tracking-tighter">{product.etat}</span>
                </div>
              )}

              <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                src={product.image} 
                className="w-4/5 h-4/5 object-contain drop-shadow-2xl"
                alt={product.title}
              />
            </motion.div>
          </section>

          {/* RIGHT: CONTENT */}
          <section className="flex flex-col gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#94C973]">
                <Zap size={14} fill="currentColor" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{product.subtitle}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-light tracking-tighter uppercase leading-[0.9]">
                {product.title}<span className="text-[#94C973]">.</span>
              </h1>
            </div>

            {/* PRICE CARD */}
            <div className="p-10 rounded-[40px] bg-white border border-black/5 shadow-sm space-y-8">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                      {accountType === "COMPANY" ? "Tarif Pro (HT)" : "Prix Public TTC"}
                    </p>
                    <h2 className="text-2xl font-light tracking-tighter">
                      {(product.price * (Number(quantity) || 0)).toLocaleString()}
                      <span className="text-2xl ml-2 font-medium">TND</span>
                    </h2>
                  </div>
                  
                  {/* QUANTITY PICKER */}
                  <div className="flex items-center bg-zinc-50 rounded-2xl p-1 border border-zinc-100">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, (Number(q) || 1) - 1))} 
                      className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                    >
                      <Minus size={16}/>
                    </button>

                    <input
                      type="number"
                      value={quantity}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      onFocus={(e) => e.target.select()}
                      className="w-12 text-center bg-transparent border-none focus:outline-none focus:ring-0 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <button 
                      onClick={() => setQuantity(q => (Number(q) || 0) + 1)} 
                      className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                    >
                      <Plus size={16}/>
                    </button>
                  </div>
               </div>

               <button 
                  onClick={handleAddToCart}
                  disabled={isAdded || quantity === "" || quantity < 1}
                  className={cn(
                    "w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-500 flex items-center justify-center gap-3",
                    isAdded ? "bg-zinc-100 text-zinc-400" : "bg-[#0D2C30] text-white hover:bg-[#1a3d42] shadow-xl shadow-[#0D2C30]/10"
                  )}
                >
                  {isAdded ? (
                    <>Produit ajouté <CheckCircle2 size={18} className="text-[#94C973]" /></>
                  ) : (
                    <>Ajouter au panier <ArrowRight size={16} /></>
                  )}
                </button>
            </div>

            {/* SPECS & DESCRIPTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</h3>
                  <p className="text-lg text-[#0D2C30]/70 leading-relaxed font-medium">
                    {product.description}
                  </p>
               </div>
               <div className="divide-y divide-black/5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Spécifications</h3>
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-4">
                      <span className="text-[10px] font-bold uppercase text-zinc-400">{spec.label}</span>
                      <span className="text-[11px] font-black uppercase">{spec.value}</span>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;