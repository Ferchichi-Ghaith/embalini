"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plus, Minus, ArrowRight, Zap, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

// --- 1. Définition des Interfaces TypeScript ---

interface ProductSpec {
  label: string;
  value: string;
}

interface Product {
  id: string;
  title: string;
  nom?: string; // Support pour variation de nom API
  subtitle: string;
  price: number;
  image: string;
  description: string;
  specs: ProductSpec[];
}

// 2. Type pour le contenu du panier (localStorage)
interface CartItem {
  id: string;
  titre: string;
  quantite: number;
  prix_unitaire: number;
  prix_total: string;
  productimage: string;
}

// 3. Simulé depuis vos informations utilisateur
type AccountType = "COMPANY" | "INDIVIDUAL";

const ProductPage = () => {
  const params = useParams();
  
  // Typage des états React
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  
  const { scrollY } = useScroll();
  
  // Utilisation de la logique de compte provenant de vos consignes
  const accountType: AccountType = "COMPANY"; 

  // --- Fetching API ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Utilisation de params.id typé comme string
        const response = await fetch(`/api/v1/produit/${params.id}`);
        if (!response.ok) throw new Error("Erreur réseau");
        
        const data: Product = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  // Effet de Parallaxe
  const yImage = useTransform(scrollY, [0, 500], [0, -50]);

  // --- Rendu conditionnel (Chargement) ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB]">
        <Loader2 className="animate-spin text-[#A3E635]" size={48} />
      </div>
    );
  }

  if (!product) return <div className="text-center pt-40">Produit non trouvé.</div>;

  // --- Gestion du Panier (avec typage) ---
  const handleAddToCart = () => {
    const nouveauProduit: CartItem = {
      id: product.id,
      titre: product.title || product.nom || "Produit",
      quantite: quantity,
      prix_unitaire: product.price,
      prix_total: (product.price * quantity).toFixed(2),
      productimage: product.image,
    };

    const panierExistant: CartItem[] = JSON.parse(localStorage.getItem("productpanierlist") || "[]");
    const nouveauPanier = [...panierExistant, nouveauProduit];
    localStorage.setItem("productpanierlist", JSON.stringify(nouveauPanier));

    window.dispatchEvent(new Event("cartUpdate"));
    console.log("Panier mis à jour !",nouveauPanier);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1A1A1A] selection:bg-[#A3E635]">
      
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* SCÈNE VISUELLE */}
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
                alt={product.title}
              />
              
             
            </motion.div>
          </section>

          {/* ARCHITECTURE DE L'INFORMATION */}
          <section className="space-y-16">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-12 bg-black/20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40">
                  {product.subtitle}
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] italic">
                {product.title}<span className="text-[#A3E635]">.</span>
              </h1>
            </div>

            {/* Carte de Prix adaptée B2B/B2C */}
            <div className="p-8 rounded-[32px] bg-white border border-black/5 shadow-2xl shadow-black/2 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">
                    {accountType === "COMPANY" ? "Tarif Exclusif B2B" : "Prix de Vente"}
                  </p>
                  <h2 className="text-5xl font-light">
                    {(product.price * quantity).toFixed(2)}<span className="text-xl ml-1">TND</span>
                  </h2>
               </div>
               <div className="flex items-center bg-[#F4F4F4] rounded-2xl p-2 border border-black/5">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q-1))} 
                    className="p-4 hover:bg-white rounded-xl transition-all"
                  >
                    <Minus size={16}/>
                  </button>
                  <span className="w-12 text-center font-black text-xl">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q+1)} 
                    className="p-4 hover:bg-white rounded-xl transition-all"
                  >
                    <Plus size={16}/>
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="fill-[#A3E635] text-[#A3E635]"/> Présentation
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

            <div className="space-y-6">
              <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleAddToCart}
                className="w-full py-8 bg-[#A3E635] cursor-pointer text-black border border-black/5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-black/5 transition-all duration-500"
              >
                Ajouter au panier <ArrowRight size={18} />
              </motion.button>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;