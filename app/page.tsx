"use client";

import {CTA} from '@/components/elements/blocks/CTA';
import Footer from '@/components/elements/blocks/Footer';
import EmbaliniHero from '@/components/elements/blocks/Hero';
import ProductCard from '@/components/elements/utils/productcard';
import { motion } from 'framer-motion';

const products = [
  {
    id: "1",
    title: "Coffret Signature",
    price: "45.00 TND",
    image: "/images/p1.jpg",
    etat: "Premium"
  },
  {
    id: "2",
    title: "Étui Minimaliste",
    price: "29.00 TND",
    image: "/images/p2.png",
    etat: "Stock Limité"
  },
  {
    id: "3",
    title: "Enveloppe Kraft Luxe",
    price: "12.00 TND",
    image: "/images/p3.png",
    etat: "Eco-Conçu"
  },
  {
    id: "4",
    title: "Coffret Signature",
    price: "45.00 TND",
    image: "/images/p1.jpg",
    etat: "Premium"
  },
  {
    id: "5",
    title: "Étui Minimaliste",
    price: "29.00 TND",
    image: "/images/p2.png",
    etat: "Stock Limité"
  },
  {
    id: "6",
    title: "Enveloppe Kraft Luxe",
    price: "12.00 TND",
    image: "/images/p3.png",
    etat: "Eco-Conçu"
  }
];

const Page = () => {
  return (
    // Suppression de h-screen pour laisser le contenu défiler naturellement
    <main className="min-h-screen bg-[#FBFBFB]">
      
      {/* 1. Hero Section */}
      <EmbaliniHero />
      
      {/* 2. Products Section avec Titre de Transition */}
      <section className="container mx-auto py-24 px-6">
        <div className="mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <span className="h-px w-12 bg-[#A3E635]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40">
              Catalogue 2026
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-[1000] tracking-tighter uppercase italic"
          >
            Sélection <span className="text-[#A3E635]">Premium</span>
          </motion.h2>
        </div>

        {/* Grille Staggered : décalage visuel pour le look "Design" */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {products.map((product, index) => (
            <div 
              key={product.id}
              // Décale une carte sur deux sur desktop
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </section>
      <CTA/>
   
     
    </main>
  );
};

export default Page;