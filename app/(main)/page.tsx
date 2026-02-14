"use client";

import { useEffect, useState } from 'react';
import { CTA } from '@/components/elements/blocks/CTA';
import EmbaliniHero from '@/components/elements/blocks/Hero';
import ProductCard from '@/components/elements/utils/productcard';
import { motion } from 'framer-motion';

// Définition de l'interface basée sur votre API
interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  etat: string; // Utilisation de votre champ "etat"
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/v1/produit/');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#FBFBFB]">
      <EmbaliniHero />
      
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="animate-pulse text-black/50 uppercase tracking-widest">Chargement du catalogue...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {products.map((product) => (
              <div key={product.id}>
                {/* On passe les props directement, ProductCard utilisera 'etat' */}
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}
      </section>
      
      <CTA />
    </main>
  );
};

export default Page;