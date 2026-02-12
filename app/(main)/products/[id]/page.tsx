"use client";

import React, { useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plus, Minus, ArrowRight, Zap } from "lucide-react";
import { useParams } from "next/navigation";

// --- Types & Données Mockées ---
const productsData = [
  {
    id: "1",
    title: "Coffret Signature",
    subtitle: "Série_01",
    price: 45.00,
    image: "/images/p1.jpg", 
    etat: "Premium",
    description: "Une structure architecturale alliée au luxe sensoriel. Conçu pour les marques qui considèrent le déballage comme une véritable cérémonie.",
    specs: [
      { label: "Matériau", value: "Éco-Fibre 1200g" },
      { label: "Finition", value: "Mat Soft-Touch" },
      { label: "Origine", value: "France" }
    ]
  },
  {
    id: "2",
    title: "Étui Minimaliste",
    subtitle: "Série_02",
    price: 29.00,
    image: "/images/p2.png",
    etat: "Stock Limité",
    description: "Épuré, protecteur et d'une élégance naturelle pour des présentations de vente haut de gamme.",
    specs: [
      { label: "Matériau", value: "Polymère Recyclé" },
      { label: "Finition", value: "Satiné" },
      { label: "Origine", value: "Tunisie" }
    ]
  },
  {
    id: "3",
    title: "Enveloppe Kraft Luxe",
    subtitle: "Série_03",
    price: 12.00,
    image: "/images/p3.png",
    etat: "Éco-Conçu",
    description: "Sophistication durable. Le choix privilégié pour l'expédition éco-responsable d'accessoires ou de documents.",
    specs: [
      { label: "Matériau", value: "Kraft Organique" },
      { label: "Origine", value: "France" }
    ]
  },
  // Les IDs 4, 5, et 6 suivent la même structure...
];

const ProductPage = () => {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const { scrollY } = useScroll();
  
  // Simulation du type de compte (COMPANY | INDIVIDUAL)
  const accountType = "COMPANY"; 
  
  const product = useMemo(() => {
    return productsData.find((p) => p.id === params.id) || productsData[0];
  }, [params.id]);

  // Effets de Parallaxe
  const yImage = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1A1A1A] selection:bg-[#A3E635]">
      
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* 1. SCÈNE VISUELLE */}
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
              
              {/* Badge d'état (utilisant le champ "etat" de votre API) */}
              <div className="absolute top-8 left-8 bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {product.etat}
              </div>
            </motion.div>
          </section>

          {/* 2. ARCHITECTURE DE L'INFORMATION */}
          <section className="space-y-16">
            
            {/* Bloc Titre */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-12 bg-black/20" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40">{product.subtitle}</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] italic">
                {product.title}<span className="text-[#A3E635]">.</span>
              </h1>
            </div>

            {/* Carte de Prix */}
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

            {/* Grille Description & Specs */}
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

            {/* SECTION APPEL À L'ACTION */}
            <div className="space-y-6">
             
              
              <motion.button 
               onClick={() => {
                const nouveauProduit = {
                  id: product.id,
                  titre: product.title,
                  quantite: quantity,
                  prix_unitaire: product.price,
                  prix_total: (product.price * quantity).toFixed(2),
                  productimage : product.image,
                };
              
                const panierExistant = JSON.parse(localStorage.getItem("productpanierlist") || "[]");
                const nouveauPanier = [...panierExistant, nouveauProduit];
                localStorage.setItem("productpanierlist", JSON.stringify(nouveauPanier));
              
                // --- LE DÉCLENCHEUR ---
                // On crée et diffuse l'événement pour que la Navbar se mette à jour
                window.dispatchEvent(new Event("cartUpdate"));
                
                console.log("Panier mis à jour !");
              }}
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